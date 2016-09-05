import {ExpressApp} from "./core/ExpressApp";
import {ClassScanner} from "./ClassScanner";
import {DatabaseConnector} from "./core/data/DatabaseConnector";


async function start() {
    DatabaseConnector.connect();

    var initializer = new ClassScanner();
    await initializer.initialize();
    await DatabaseConnector.sync();
    var app = new ExpressApp();
    app.start();
}

start();