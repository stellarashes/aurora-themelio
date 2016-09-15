import {RouteHandler} from "../RouteHandler";
import {RouteData} from "../RegistryEntry";
export class RouteHandlerFactory {
    public getRouteHandler(data: RouteData) {
        return new RouteHandler(data);
    }
}