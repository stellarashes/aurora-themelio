import {Database} from "./core/data/Database";
import {DefaultServiceScanner} from "./core/DefaultServiceScanner";
import {ClassScanner} from "./core/ClassScanner";
export class Initializer {
    public static async run() {
        try {
            Database.initialize();
            await ClassScanner.initialize();
            await DefaultServiceScanner.scan();
            Database.linkAllRelations();
            return Database.sync();
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
}