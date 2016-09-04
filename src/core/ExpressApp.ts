import * as express from 'express';
import {Application} from "express";
import {RouteRegistry} from "./RouteRegistry";
import {SiteConfig} from "../SiteConfig";

export class ExpressApp {
    private app: Application;

    constructor() {
        this.app = express();
        this.app.disable('x-powered-by');
    }

    public start() {
        RouteRegistry.registerRoutesToApp(this.app);
        let port = SiteConfig.SitePort;
        this.app.listen(port);
    }
}