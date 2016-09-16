import {ExpressApp} from "./core/ExpressApp";
import {Initializer} from "./Initializer";

export class Server {
    public static async start() {
        try {
            Initializer.run();
            let app = new ExpressApp();
            app.start();
        } catch (e) {
            console.error(e);
        }
    }
}
