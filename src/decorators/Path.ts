import {RouteRegistry} from "../core/RouteRegistry";
import {unravelWrappedConstructor} from "./util";
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

export let Route = Path;

function padPath(path:string): string {
    if (path.charAt(0) !== '/') {
        return '/' + path;
    }
    return path;
}