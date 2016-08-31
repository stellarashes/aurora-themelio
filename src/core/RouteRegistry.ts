import {Application} from "express";
import {RouteHandler} from "./RouteHandler";
const basePathMetaKey = 'controller:basePath';
const handlerPathMetaKey = 'controller:handlePath';

export class RouteRegistry {
    private static handlerMethods: RegistryEntry[] = [];

    public static setControllerBasePath(controller: any, path: string) {
        Reflect.defineMetadata(basePathMetaKey, path, controller);
    }

    public static setHandlerPath(controller: any, handler: string, path: string) {
        Reflect.defineMetadata(handlerPathMetaKey, path, controller, handler);
    }

    public static setHandlerMethod(controller: any, handler: string, method: string) {
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

            listenMethod.call(app, fullPath, (req, res) => {
                return wrappedHandler.handleRequest(req, res);
            });
        }
    }

    private static getHandlerFullPath(controller: any, handler: string) {
        return RouteRegistry.getBasePath(controller) + RouteRegistry.getHandlerPath(controller, handler);
    }

    private static getBasePath(controller: any) {
        return Reflect.getMetadata(basePathMetaKey, controller) || '';
    }

    private static getHandlerPath(controller: Function, handler: string) {
        return Reflect.getMetadata(handlerPathMetaKey, controller, handler) || '';
    }
}


interface RegistryEntry {
    controller: any;
    handler: string;
    method: string;
}