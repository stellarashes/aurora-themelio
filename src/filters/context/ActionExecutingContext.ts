import {HttpContext} from "../../core/HttpContext";
import {RouteData} from "../../core/RouteData";
import {ControllerContext} from "./ControllerContext";

export class ActionExecutingContext extends ControllerContext {
    public httpContext: HttpContext;
    public result: any;
    public error: Error;
    public routeData: RouteData;
}