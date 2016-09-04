import {Request} from "express";
import {Response} from "express";
import {Container, Inject, AutoWired} from "typescript-ioc";
import {GUID} from "./util/GUID";
import {CacheService} from "./cache/CacheService";

const metaCacheKey = 'controller:cache-guid';
const metaCacheDuration = 'controller:cache-duration';

@AutoWired
export class RouteHandler {
    private controller: Function;
    private handler: string;
    private parameters: ParamInfo[] = [];
    @Inject private cacheService: CacheService;

    public static META_CACHE_KEY = metaCacheKey;
    public static META_CACHE_DURATION = metaCacheDuration;

    constructor(controller: Function, handler: string) {
        this.controller = controller;
        this.handler = handler;

        this.populateParameters();
    }

    public async handleRequest(req: Request, res: Response) {
        let shouldCache = Reflect.hasMetadata(metaCacheKey, this.controller, this.handler);
        let cacheKey = '';

        if (shouldCache) {
            cacheKey = Reflect.getMetadata(metaCacheKey, this.controller, this.handler);
            let isCached = await this.cacheService.exists(cacheKey);
            if (isCached) {
                let cachedData = await this.cacheService.get(cacheKey);
                res.end('Cached:' + cachedData);
                return;
            }
        }

        let instance = Container.get(this.controller.constructor);
        let handler = instance[this.handler];

        var params = this.populateRequestParameters(req);
        try {
            let outputValue = await handler.apply(instance, params);
            res.json(outputValue);

            if (shouldCache) {
                let cacheData = JSON.stringify(outputValue);
                await this.cacheService.set(cacheKey, cacheData);
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

    private populateRequestParameter(req: Request, param: ParamInfo) {
        if (req.params.hasOwnProperty(param.name)) {
            return req.params[param.name];
        }

        if (req.query.hasOwnProperty(param.name)) {
            return req.query[param.name];
        }

        return undefined;
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
    let result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if(result === null)
        result = [];
    return result;
}