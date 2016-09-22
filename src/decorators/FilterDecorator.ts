import {ActionFilter} from "../filters/ActionFilter";
import {RouteRegistry} from "../core/RouteRegistry";
import {unravelWrappedConstructor} from "./util";
export function FilterDecorator(filter: ActionFilter) {
    return function (target: any, handler?: any) {
        if (target instanceof Function) {
            var controller = unravelWrappedConstructor(target);
            // RouteRegistry.setControllerBasePath(controller, path);
            // TODO set a route data for controller as the base and each handler should merge its data with the base; refactor;
        } else {
            RouteRegistry.updateRouteData(target, handler, x => {
                if (!x.filters) {
                    x.filters = [];
                }
                x.filters.push(filter);
            });
        }
    }
}