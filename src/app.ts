import {ExpressApp} from "./core/ExpressApp";
import {ClassScanner} from "./core/ClassScanner";
import {DatabaseConnector} from "./core/data/DatabaseConnector";


export async function start() {
    DatabaseConnector.initialize();
    await ClassScanner.initialize();
    await DatabaseConnector.sync();
    var app = new ExpressApp();
    app.start();
}

start();