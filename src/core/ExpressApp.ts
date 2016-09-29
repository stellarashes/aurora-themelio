import * as express from "express";
import {Application} from "express";
import {RouteRegistry} from "./RouteRegistry";
import {SiteConfig} from "../SiteConfig";
import {json} from "body-parser";
import {ServerOptions} from "../Server";

export class ExpressApp {
    private app: Application;

    constructor() {
        this.app = express();
        this.app.disable('x-powered-by');
        this.app.use(json());
    }

    public init(params?: ServerOptions) {
        if (params && params.middlewares) {
            for (let middleware of params.middlewares) {
                this.app.use(middleware);
            }
        }
        RouteRegistry.registerRoutesToApp(this.app);
    }

    public start() {
        let port = SiteConfig.SitePort;
        this.app.listen(port);
    }

    public getExpressApp() {
        return this.app;
    }
}