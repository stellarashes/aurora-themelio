import {Application} from "express";
import {DataModel} from "./data/DataModel";
import {GUID} from "./util/GUID";
import {CacheConditionDelegate} from "../decorators/Cache";
import {RouteHandlerFactory} from "./factory/RouteHandlerFactory";
import {Container} from "typescript-ioc";
import {RouteData} from "./RouteData";
import {ActionFilter} from "../filters/ActionFilter";

const routeMetaKey = Symbol('controller:route');
const basePathMetaKey = 'controller:basePath';


export class RouteRegistry {
    private static handlerMethods: Set<RegistryEntry> = new Set<RegistryEntry>();

    public static setControllerBasePath(controller: any, path: string) {
        RouteRegistry.updateControllerData(controller, x => Object.assign(x, {basePath: path}));
    }

    public static setHandlerPath(controller: any, handler: string, path: string) {
        this.updateRouteData(controller, handler, x => {x.handlerPath = path; return x;});
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

    private static updateControllerData(controller: any, delegate: RouteUpdateDelegate) {
        let controllerData = RouteRegistry.getControllerData(controller);
        let modifiedData = delegate(controllerData);
        Reflect.defineMetadata(basePathMetaKey, modifiedData || controllerData, controller);
    }

    private static getControllerData(controller: any) {
        return Reflect.getMetadata(basePathMetaKey, controller) || {};
    }

    private static updateRouteData(controller: any, handler: string, delegate: RouteUpdateDelegate) {
        let routeData = this.getRouteData(controller, handler);
        routeData = delegate(routeData);
        Reflect.defineMetadata(routeMetaKey, routeData, controller, handler);
    }

    private static getRouteData(controller: any, handler: string) {
        return Reflect.getMetadata(routeMetaKey, controller, handler) || {};
    }

    public static setHandlerMethod(controller: any, handler: string, method: string) {
        this.updateRouteData(controller, handler, x => {
            return this.mergeData(x, {
                controller: controller,
                handler: handler,
                methods: [method]
            });
        });
        this.findOrCreateEntry(controller, handler);
    }

    public static setControllerFilter(controller: any, filter: ActionFilter) {
        this.updateControllerData(controller, x => this.mergeData(x, {filters: [filter]}));
    }

    public static setHandlerFilter(controller: any, handler: string, filter: ActionFilter) {
        this.updateRouteData(controller, handler, x => {
            return this.mergeData(x, {
                controller: controller,
                handler: handler,
                filters: [filter]
            });
        });
        this.findOrCreateEntry(controller, handler);
    }

    private static mergeData(startRoute: RouteData, additions: any): RouteData {
        let methods = [];
        if (additions.methods) {
            methods = startRoute.methods || [];
            for (let method of additions.methods) {
                if (!methods.find(x => x.toLowerCase() === method.toLowerCase())) {
                    methods.unshift(method);
                }
            }
            additions.methods = methods;
        }

        let filters = [];
        if (additions.filters) {
            filters = startRoute.filters || [];
            for (let filter of additions.filters) {
                if (!filters.find(x => x === filter)) {
                    filters.push(filter);
                }
            }
            additions.filters = filters;
        }

        return Object.assign(startRoute, additions);
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
            let baseData = this.getControllerData(route.controller);
            let routeData = this.getRouteData(route.controller, route.handler);
            let finalRouteData = this.mergeData(baseData, routeData);
            let wrappedHandler = handlerFactory.getRouteHandler(finalRouteData);

            wrappedHandler.registerRoutes(app);
        }
    }
}

interface RegistryEntry {
    controller: Function;
    handler: string;
}


export interface RouteUpdateDelegate {
    (previous: RouteData): RouteData;
}