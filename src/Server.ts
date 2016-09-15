import {ExpressApp} from "./core/ExpressApp";
import {ClassScanner} from "./core/ClassScanner";
import {DatabaseConnector} from "./core/data/DatabaseConnector";
import {DefaultServiceScanner} from "./core/DefaultServiceScanner";

export class Server {
    public static async start() {
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
}
