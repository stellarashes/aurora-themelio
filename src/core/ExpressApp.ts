import * as express from 'express';
import {Application} from "express";
import {RouteRegistry} from "./RouteRegistry";

export class ExpressApp {
    private app: Application;

    constructor() {
        this.app = express();
        this.app.disable('x-powered-by');
    }

    public start() {
        RouteRegistry.registerRoutesToApp(this.app);
        let port = process.env.PORT || 3000;
        this.app.listen(port);
    }
}