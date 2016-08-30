import {AutoWired} from "typescript-ioc";

import * as express from 'express';

@AutoWired
export class ExpressApp {
    private app;

    constructor() {
        this.app = express();
    }

    public register(path, controller, handler, method) {
        this.app[method].call(null, path, (req, res) => {

        });
    }

    public start() {
        let port = process.env.PORT || 3000;
        this.app.listen(port);
    }
}