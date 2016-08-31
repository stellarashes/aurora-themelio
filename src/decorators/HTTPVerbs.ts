import {RouteRegistry} from "../core/RouteRegistry";
function http(verb: string) {
    return function (target: Function, key: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => any>) {
        RouteRegistry.setHandlerMethod(target, key, verb);
    }
}

export let GET: Function = http('GET');
export let POST: Function = http('POST');
export let PUT: Function = http('PUT');
export let UPDATE: Function = http('UPDATE');
export let DELETE: Function = http('DELETE');
