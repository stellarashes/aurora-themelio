import {ActionFilter} from "../filters/ActionFilter";
import {RouteRegistry} from "../core/RouteRegistry";
import {unravelWrappedConstructor} from "./util";
export function Filter(filter: ActionFilter) {
	return function (target: any, handler?: any) {
		if (target instanceof Function) {
			var controller = unravelWrappedConstructor(target);
			RouteRegistry.setControllerFilter(controller, filter);
		} else {
			RouteRegistry.setHandlerFilter(target, handler, filter);
		}
	}
}