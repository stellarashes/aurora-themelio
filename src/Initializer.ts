import {DatabaseConnector} from "./core/data/DatabaseConnector";
import {DefaultServiceScanner} from "./core/DefaultServiceScanner";
import {ClassScanner} from "./core/ClassScanner";
export class Initializer {
    public static async run() {
        DatabaseConnector.initialize();
        await ClassScanner.initialize();
        await DefaultServiceScanner.scan();
        DatabaseConnector.linkAllRelations();
        return DatabaseConnector.sync();
    }
}