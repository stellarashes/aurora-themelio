import {HttpContext} from "../../core/HttpContext";
import {RouteData} from "../../core/RouteData";

export abstract class ControllerContext {
    public httpContext: HttpContext;
    public metadata: any;
    public error: Error;
    public routeData: RouteData;
    public fromCache: boolean;

    constructor(context?: ControllerContext) {
        if (context) {
            this.httpContext = context.httpContext;
            this.metadata = context.metadata;
            this.error = context.error;
            this.routeData = context.routeData;
        }
    }
}