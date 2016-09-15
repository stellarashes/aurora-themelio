import {DataModel} from "../core/data/DataModel";
import {RouteRegistry} from "../core/RouteRegistry";

export function CRUD(targetModel: typeof DataModel) {
    return function (target: any, handler: string) {
        RouteRegistry.setCRUD(target, handler, targetModel);
    }
}