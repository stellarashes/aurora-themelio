import {ExpressApp} from "./core/ExpressApp";
import {ClassScanner} from "./core/ClassScanner";
import {DatabaseConnector} from "./core/data/DatabaseConnector";
import {DefaultServiceScanner} from "./core/DefaultServiceScanner";

export * from "./core/data/DataModel";
export * from "./services/cache/CacheService";
export * from "./SiteConfig";
export * from "./decorators";
export * from "./queues/Queue";
export * from "./queues/SimpleDatabaseQueue";
export * from "./queues/ObjectDatabaseQueue";

export async function start() {
    try {
        await DatabaseConnector.initialize();
        await ClassScanner.initialize();
        await DefaultServiceScanner.scan();
        await DatabaseConnector.sync();
        var app = new ExpressApp();
        app.start();
    } catch (e) {
        console.error(e);
    }
}