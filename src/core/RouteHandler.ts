import {Request, Response, Application} from "express";
import {Container} from "typescript-ioc";
import {CacheService} from "../services/cache/CacheService";
import {CRUDHandlerFactory} from "./factory/CRUDHandlerFactory";
import {ErrorHandler} from "./exceptions/ErrorHandler";
import {RouteData} from "./RouteData";
import {ContextFactory} from "../filters/context/ContextFactory";
import {ActionFilter} from "../filters/ActionFilter";
import {ControllerContext} from "../filters/context/ControllerContext";
import {ActionResultRenderer} from "./render/ActionResultRenderer";

export class RouteHandler {
	private controller: Function;
	private handler: string;
	private parameters: ParamInfo[] = [];
	private cacheService: CacheService;
	private data: RouteData;
	private crudHandlerFactory: CRUDHandlerFactory;
	private contextFactory: ContextFactory;

	constructor(routeData: RouteData) {
		this.controller = routeData.controller;
		this.handler = routeData.handler;
		this.data = routeData;
		this.cacheService = Container.get(CacheService);
		this.crudHandlerFactory = Container.get(CRUDHandlerFactory);
		this.contextFactory = Container.get(ContextFactory);

		this.populateParameters();
	}

	public registerRoutes(app: Application) {
		this.validate();
		let fullPath = this.getFullPath();
		if (this.data.CRUD) {
			let pk = this.data.CRUD.getPKNames();
			let byIdPath;
			if (pk.length === 1) {
				byIdPath = fullPath + '/:' + pk[0];
			} else {
				byIdPath = fullPath;
			}
			let handler = (req, res) => this.handleRequest(req, res);
			app.post(fullPath, handler);
			app.get(byIdPath, handler);
			app.put(fullPath, handler);
			if (byIdPath !== fullPath)
				app.put(byIdPath, handler);
			app.delete(byIdPath, handler);
		}

		if (this.data.methods) {
			for (let method of this.data.methods) {
				let listenMethod = app[method.toLowerCase()];
				listenMethod.call(app, fullPath, (req, res) => this.handleRequest(req, res));
			}
		}
	}

	private validate() {
		let returnType = Reflect.getMetadata('design:returntype', this.data.controller, this.data.handler);
		if (returnType !== Promise) {
			console.warn("Handler on " + this.data.controller.constructor.name + "." + this.data.handler + " is not marked async");
		}
	}

	private getFullPath(): string {
		let basePath = removeTrailingSlashes(this.data.basePath || '');
		let handlerPath = removeTrailingSlashes(addLeadingSlash(this.data.handlerPath || '')); // add leading slash in handlerPath if needed
		return basePath + handlerPath;
	}

	private async handleRequest(req: Request, res: Response) {
		try {
			let instance = Container.get(this.controller.constructor);
			let handler = instance[this.handler];

			let params = this.populateRequestParameters(req);

			let shouldCache = this.data.cacheDuration && (!this.data.cacheCondition || this.data.cacheCondition(req)), isCached = false;
			let result;
			let cacheKey = '';

			let actionExecutingContext;

			if (shouldCache) {
				cacheKey = this.data.cacheKey + JSON.stringify(params);
				isCached = await this.cacheService.exists(cacheKey);
				if (isCached) {
					let cachedData = await this.cacheService.get(cacheKey);
					result = JSON.parse(cachedData);
					res.header('X-Cache', 'HIT from application');
				}
			}

			actionExecutingContext = this.contextFactory.createActionExecutingContext(req, res, this.data, params, isCached);
			await this.invokeFilters(x => x.onActionExecuting, actionExecutingContext);

			try {
				if (!isCached) {
					if (this.data.CRUD) {
						let crudHandler = this.crudHandlerFactory.getHandler(req, this.data.CRUD);
						result = await crudHandler.handleCRUD();
					}

					let controllerResponse = await handler.apply(instance, params);
					result = controllerResponse || result || '';    // prioritize handler response; if handler has no response, use CRUD response if available
				}
			} catch (e) {
				actionExecutingContext.error = e;
			}

			let actionExecutedContext = this.contextFactory.createActionExecutedContext(actionExecutingContext, result);
			await this.invokeFilters(x => x.onActionExecuted, actionExecutedContext);

			let resultExecutingContext = this.contextFactory.createResultExecutingContext(actionExecutedContext);
			await this.invokeFilters(x => x.onResultExecuting, resultExecutingContext);

			let renderer = Container.get(ActionResultRenderer);
			let outputResult = await renderer.doRender(resultExecutingContext);

			if (shouldCache && !isCached) {
				let cacheData = JSON.stringify(result);
				await this.cacheService.set(cacheKey, cacheData);

				let cacheDuration = this.data.cacheDuration;
				await this.cacheService.expire(cacheKey, cacheDuration);
			}

			let resultExecutedContext = this.contextFactory.createResultExecutedContext(resultExecutingContext, outputResult, shouldCache ? cacheKey : null);
			await this.invokeFilters(x => x.onResultExecuted, resultExecutedContext);
		} catch (e) {
			let handler = Container.get(ErrorHandler);
			handler.handleError(e, req, res);
		}
	}


	private async invokeFilters(selectTargetFunction: FilterFunction, context: ControllerContext) {
		if (this.data.filters) {
			for (let filter of this.data.filters) {
				let method = selectTargetFunction(filter);
				await method.call(filter, context);
			}
		}
	}

	private populateParameters(): void {
		let metadata = Reflect.getMetadata('design:paramtypes', this.controller, this.handler);
		let names = getParameterNames(this.controller[this.handler]);

		for (let i = 0; i < names.length; i++) {
			let info = {
				name: names[i],
				type: metadata[i],
			};
			this.parameters.push(info);
		}
	}

	private populateRequestParameters(req: Request): any[] {
		let params = [];

		for (let param of this.parameters) {
			params.push(RouteHandler.populateRequestParameter(req, param));
		}

		return params;
	}

	private static populateRequestParameter(req: Request, param: ParamInfo) {
		if (req.params.hasOwnProperty(param.name)) {
			return req.params[param.name];
		}

		if (req.query.hasOwnProperty(param.name)) {
			return req.query[param.name];
		}

		return undefined;
	}
}

interface FilterFunction {
	(filter: ActionFilter): Function;
}

function removeTrailingSlashes(input: string) {
	return input.replace(/\/+$/, '');
}

function addLeadingSlash(input: string) {
	return input.replace(/^[^\/]/, '/');
}

interface ParamInfo {
	name: string,
	type: any
}

let STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg;
let ARGUMENT_NAMES = /([^\s,]+)/g;

function getParameterNames(func: Function) {
	let fnStr = func.toString().replace(STRIP_COMMENTS, '');
	let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
	if (result === null)
		result = [];
	return result;
}