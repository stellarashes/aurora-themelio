import {RouteHandler} from "../RouteHandler";
import {RouteData} from "../RouteData";
export class RouteHandlerFactory {
    public getRouteHandler(data: RouteData) {
        return new RouteHandler(data);
    }
}