import {Application} from "express";
import {DataModel} from "./data/DataModel";
import {GUID} from "./util/GUID";
import {CacheConditionDelegate} from "../decorators/Cache";
import {RouteHandlerFactory} from "./factory/RouteHandlerFactory";
import {Container} from "typescript-ioc";
import {RouteData} from "./RouteData";

const routeMetaKey = Symbol('controller:route');
const basePathMetaKey = 'controller:basePath';


export class RouteRegistry {
    private static handlerMethods: Set<RegistryEntry> = new Set<RegistryEntry>();

    public static setControllerBasePath(controller: any, path: string) {
        Reflect.defineMetadata(basePathMetaKey, path, controller);
    }

    public static setHandlerPath(controller: any, handler: string, path: string) {
        this.updateRouteData(controller, handler, x => x.handlerPath = path);
    }

    public static setCRUD(controller: any, handler: string, model: typeof DataModel) {
        this.updateRouteData(controller, handler, x => Object.assign(x, {
            controller: controller,
            handler: handler,
            CRUD: model
        }));

        this.findOrCreateEntry(controller, handler);
    }

    public static setCacheDuration(controller: any, handler: string, condition: CacheConditionDelegate, seconds: number) {
        this.updateRouteData(controller, handler, x => Object.assign(x, {
            cacheDuration: seconds,
            cacheKey: 'controller' + GUID.getGUID(),
            cacheCondition: condition,
        }));
    }

    public static updateRouteData(controller: any, handler: string, delegate: RouteUpdateDelegate) {
        let routeData = this.getRouteData(controller, handler);
        routeData = delegate(routeData);
        Reflect.defineMetadata(routeMetaKey, routeData, controller, handler);
    }

    private static getRouteData(controller: any, handler: string) {
        return Reflect.getMetadata(routeMetaKey, controller, handler) || {};
    }

    public static setHandlerMethod(controller: any, handler: string, method: string) {
        this.updateRouteData(controller, handler, x => {
            let methods = x.methods || [];
            if (methods.filter(x => x.toLowerCase() === method.toLowerCase()).length === 0) {
                methods.push(method);
            }
            return Object.assign(x, {
                controller: controller,
                handler: handler,
                methods: methods
            });
        });
        this.findOrCreateEntry(controller, handler);
    }

    private static findOrCreateEntry(controller: any, handler: string) {
        this.handlerMethods.add({
            controller: controller,
            handler: handler
        });
    }

    public static registerRoutesToApp(app: Application) {
        let handlerFactory = Container.get(RouteHandlerFactory);
        for (let route of RouteRegistry.handlerMethods) {
            let basePath = this.getBasePath(route.controller);
            let routeData = this.getRouteData(route.controller, route.handler);
            routeData.basePath = basePath;
            let wrappedHandler = handlerFactory.getRouteHandler(routeData);

            wrappedHandler.registerRoutes(app);
        }
    }

    private static getBasePath(controller: any) {
        return Reflect.getMetadata(basePathMetaKey, controller) || '';
    }
}

interface RegistryEntry {
    controller: Function;
    handler: string;
}


export interface RouteUpdateDelegate {
    (previous: RouteData): void;
}