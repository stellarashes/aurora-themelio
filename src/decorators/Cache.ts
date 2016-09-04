import {RouteHandler} from "../core/RouteHandler";
import {GUID} from "../core/util/GUID";

export function Cache(seconds: number) {
    return function (target: any, key: string, descriptor: any) {
        setCacheDuration(target, key, seconds);
    }
}

function setCacheDuration(controller: any, handler: string, seconds: number) {
    Reflect.defineMetadata(RouteHandler.META_CACHE_KEY, GUID.getGUID(), controller, handler);
    Reflect.defineMetadata(RouteHandler.META_CACHE_DURATION, seconds, controller, handler);
}