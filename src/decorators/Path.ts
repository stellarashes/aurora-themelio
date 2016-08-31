

import {RouteRegistry} from "../core/RouteRegistry";
export function Path(path: string) {
    path = padPath(path);
    return function(target: any, key?: string, value?: any): any {
        if (target instanceof Function) {
            RouteRegistry.setControllerBasePath(target, path);
        } else {
            RouteRegistry.setHandlerPath(target.constructor, key, path);
        }
    }
}

function padPath(path:string): string {
    if (path.charAt(0) !== '/') {
        return '/' + path;
    }
    return path;
}