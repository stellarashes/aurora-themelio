import {DatabaseConnector} from "./core/data/DatabaseConnector";
import {DefaultServiceScanner} from "./core/DefaultServiceScanner";
import {ClassScanner} from "./core/ClassScanner";
export class Initializer {
    public static async run() {
        try {
            DatabaseConnector.initialize();
            await ClassScanner.initialize();
            await DefaultServiceScanner.scan();
            DatabaseConnector.linkAllRelations();
            return DatabaseConnector.sync();
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
}