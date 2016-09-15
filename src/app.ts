import {ExpressApp} from "./core/ExpressApp";
import {ClassScanner} from "./core/ClassScanner";
import {DatabaseConnector} from "./core/data/DatabaseConnector";
import {DefaultServiceScanner} from "./core/DefaultServiceScanner";

export * from "./core/data/DataModel";
export * from "./services/cache/CacheService";
export * from "./SiteConfig";
export * from "./decorators";
export * from "./queues";

export async function start() {
    try {
        DatabaseConnector.initialize();
        await ClassScanner.initialize();
        await DefaultServiceScanner.scan();
        DatabaseConnector.linkAllRelations();
        await DatabaseConnector.sync();
        let app = new ExpressApp();
        app.start();
    } catch (e) {
        console.error(e);
    }
}