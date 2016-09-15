import {Request, Response, Application} from "express";
import {Container} from "typescript-ioc";
import {CacheService} from "../services/cache/CacheService";
import {RouteData} from "./RegistryEntry";
import {CRUDHandlerFactory} from "./factory/CRUDHandlerFactory";
import {ErrorHandler} from "./exceptions/ErrorHandler";

export class RouteHandler {
    private controller: Function;
    private handler: string;
    private parameters: ParamInfo[] = [];
    private cacheService: CacheService;
    private data: RouteData;
    private crudHandlerFactory: CRUDHandlerFactory;

    constructor(routeData: RouteData) {
        this.controller = routeData.controller;
        this.handler = routeData.handler;
        this.data = routeData;
        this.cacheService = Container.get(CacheService);
        this.crudHandlerFactory = Container.get(CRUDHandlerFactory);

        this.populateParameters();
    }

    public registerRoutes(app: Application) {
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

            let shouldCache = this.data.cacheDuration && (!this.data.cacheCondition || this.data.cacheCondition(req));
            let cacheKey = '';

            if (shouldCache) {
                cacheKey = this.data.cacheKey + JSON.stringify(params);
                let isCached = await this.cacheService.exists(cacheKey);
                if (isCached) {
                    let cachedData = await this.cacheService.get(cacheKey);
                    res.header('X-Cache', 'HIT from application');
                    res.end(cachedData);
                    return;
                }
            }

            let outputValue;

            if (this.data.CRUD) {
                let crudHandler = this.crudHandlerFactory.getHandler(req, this.data.CRUD);
                outputValue = await crudHandler.handleCRUD();
            }

            var handlerPromise = handler.apply(instance, params);
            if (handlerPromise) {
                let controllerResponse = await handlerPromise;
                outputValue = controllerResponse || outputValue || '';    // prioritize handler response; if handler has no response, use CRUD response if available
            } else {
                outputValue = '';
            }

            res.json(outputValue);

            if (shouldCache) {
                let cacheData = JSON.stringify(outputValue);
                await this.cacheService.set(cacheKey, cacheData);

                let cacheDuration = this.data.cacheDuration;
                await this.cacheService.expire(cacheKey, cacheDuration);
            }
        } catch (e) {
            let handler = Container.get(ErrorHandler);
            handler.handleError(e, req, res);
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