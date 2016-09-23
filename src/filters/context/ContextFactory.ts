import {ActionExecutingContext} from "./ActionExecutingContext";
import {ActionExecutedContext} from "./ActionExecutedContext";
import {Request, Response} from "express";
import {RouteData} from "../../core/RouteData";
import {HttpContext} from "../../core/HttpContext";
import {Container} from "typescript-ioc";
import {ResultExecutingContext} from "./ResultExecutingContext";
import {ResultExecutedContext} from "./ResultExecutedContext";

export class ContextFactory {
    public createActionExecutingContext(req: Request, res: Response, route: RouteData, params: any[], fromCache: boolean): ActionExecutingContext {
        let context = new ActionExecutingContext();
        context.httpContext = Container.get(HttpContext);
        context.httpContext.request = req;
        context.httpContext.response = res;
        context.actionParameters = params;
        context.routeData = route;
        context.fromCache = fromCache;

        return context;
    }

    public createActionExecutedContext(executingContext: ActionExecutingContext, result: any): ActionExecutedContext {
        return new ActionExecutedContext(executingContext, result);
    }

    public createResultExecutingContext(executedContext: ActionExecutedContext): ResultExecutingContext {
        return new ResultExecutingContext(executedContext);
    }

    public createResultExecutedContext(executingContext: ResultExecutingContext, outputResult: any, cacheKey?: string): ResultExecutedContext {
        return new ResultExecutedContext(executingContext, outputResult, cacheKey);
    }
}