import {DataModel} from "./data/DataModel";
import {CacheConditionDelegate} from "../decorators/Cache";
import {ActionFilter} from "../filters/ActionFilter";
export interface RouteData {
    controller: any;
    handler: string;
    methods: string[];
    handlerPath: string;
    basePath: string;
    CRUD?: typeof DataModel;
    cacheDuration?: number;
    cacheKey?: string;
    cacheCondition?: CacheConditionDelegate;
    filters?: ActionFilter[];
}
