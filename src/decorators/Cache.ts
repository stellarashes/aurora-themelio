import {RouteRegistry} from "../core/RouteRegistry";
import {Request} from "express";

export function Cache(seconds: number, condition?: CacheConditionDelegate) {
    return function (target: any, key: string) {
        RouteRegistry.setCacheDuration(target, key, condition, seconds);
    }
}

export interface CacheConditionDelegate {
    (request: Request): boolean;
}