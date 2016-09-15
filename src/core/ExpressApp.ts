import * as express from "express";
import {Application} from "express";
import {RouteRegistry} from "./RouteRegistry";
import {SiteConfig} from "../SiteConfig";
import {json} from "body-parser";

export class ExpressApp {
    private app: Application;

    constructor() {
        this.app = express();
        this.app.disable('x-powered-by');
        this.app.use(json());
    }

    public start() {
        RouteRegistry.registerRoutesToApp(this.app);
        let port = SiteConfig.SitePort;
        this.app.listen(port);
    }
}