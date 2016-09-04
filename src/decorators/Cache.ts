import {RouteHandler} from "../core/RouteHandler";

export function Cache(seconds: number) {
    return function (target: any, key: string, descriptor: any) {
        RouteHandler.setCacheDuration(target, key, seconds);
    }
}