import {Application} from "express";
import {RouteHandler} from "./RouteHandler";
export class RouteRegistry {
    private static basePaths = new Map<Function, string>();
    private static handlerPaths = new Map<Function, Map<string, string>>();
    private static handlerMethods: RegistryEntry[] = [];

    public static setControllerBasePath(controller: Function, path: string) {
        RouteRegistry.basePaths.set(controller, path);
    }

    public static setHandlerPath(controller: Function, handler: string, path: string) {
        if (!RouteRegistry.handlerPaths.has(controller)) {
            RouteRegistry.handlerPaths.set(controller, new Map<string, string>());
        }

        RouteRegistry.handlerPaths.get(controller).set(handler, path);
    }

    public static setHandlerMethod(controller: Function, handler: string, method: string) {
        RouteRegistry.handlerMethods.push({
            controller: controller,
            handler: handler,
            method: method
        });
    }

    public static registerRoutesToApp(app: Application) {
        for (let route of RouteRegistry.handlerMethods) {
            // keep in mind route.controller is the constructor function to the controller
            let fullPath = RouteRegistry.getHandlerFullPath(route.controller, route.handler);
            let listenMethod = app[route.method.toLowerCase()];
            let wrappedHandler = new RouteHandler(route.controller, route.handler);

            listenMethod.call(app, fullPath, (req, res, next) => {
                return wrappedHandler.handleRequest(req, res, next);
            });
        }
    }

    private static getHandlerFullPath(controller: Function, handler: string) {
        return RouteRegistry.getBasePath(controller) + RouteRegistry.getHandlerPath(controller, handler);
    }

    private static getBasePath(controller: Function) {
        if (RouteRegistry.basePaths.has(controller)) {
            return RouteRegistry.basePaths.get(controller);
        }

        return '';
    }

    private static getHandlerPath(controller: Function, handler: string) {
        if (RouteRegistry.handlerPaths.has(controller)) {
            let controllerHandlerPaths = RouteRegistry.handlerPaths.get(controller);
            if (controllerHandlerPaths.has(handler)) {
                return controllerHandlerPaths.get(handler);
            }
        }

        return '';
    }
}


interface RegistryEntry {
    controller: Function;
    handler: string;
    method: string;
}