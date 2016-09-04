import {Request, Response} from "express";
import {Container} from "typescript-ioc";
import {GUID} from "./util/GUID";
import {CacheService} from "../services/cache/CacheService";

const metaCacheKey = 'controller:cache-guid';
const metaCacheDuration = 'controller:cache-duration';

export class RouteHandler {
    private controller: Function;
    private handler: string;
    private parameters: ParamInfo[] = [];
    private cacheService: CacheService;

    constructor(controller: Function, handler: string) {
        this.controller = controller;
        this.handler = handler;
        this.cacheService = Container.get(CacheService);

        this.populateParameters();
    }

    public async handleRequest(req: Request, res: Response) {
        try {
            let instance = Container.get(this.controller.constructor);
            let handler = instance[this.handler];

            var params = this.populateRequestParameters(req);

            let shouldCache = Reflect.hasMetadata(metaCacheKey, this.controller, this.handler);
            let cacheKey = '';

            if (shouldCache) {
                cacheKey = Reflect.getMetadata(metaCacheKey, this.controller, this.handler) + JSON.stringify(params);
                let isCached = await this.cacheService.exists(cacheKey);
                if (isCached) {
                    let cachedData = await this.cacheService.get(cacheKey);
                    res.header('X-Cache', 'HIT from application');
                    res.end(cachedData);
                    return;
                }
            }

            let outputValue = await handler.apply(instance, params);
            res.json(outputValue);

            if (shouldCache) {
                let cacheData = JSON.stringify(outputValue);
                await this.cacheService.set(cacheKey, cacheData);

                let cacheDuration = Reflect.getMetadata(metaCacheDuration, this.controller, this.handler);
                await this.cacheService.expire(cacheKey, cacheDuration);
            }
        } catch (e) {
            console.error(e);
            res.status(500).end();
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

    public static setCacheDuration(controller: any, handler: string, seconds: number) {
        Reflect.defineMetadata(metaCacheKey, 'controller' + GUID.getGUID(), controller, handler);
        Reflect.defineMetadata(metaCacheDuration, seconds, controller, handler);
    }


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