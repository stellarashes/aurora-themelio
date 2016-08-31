

import {RouteRegistry} from "../core/RouteRegistry";
export function Path(path: string) {
    path = padPath(path);
    return function(target: any, key?: string, value?: any): any {
        if (target instanceof Function) {
            RouteRegistry.setControllerBasePath(unravelWrappedConstructor(target), path);
        } else {
            RouteRegistry.setHandlerPath(target, key, path);
        }
    }
}

function unravelWrappedConstructor(target: any) {
    if (target.hasOwnProperty('__parent')) {
        return unravelWrappedConstructor(target['__parent']);
    }

    return target.prototype;
}

function padPath(path:string): string {
    if (path.charAt(0) !== '/') {
        return '/' + path;
    }
    return path;
}