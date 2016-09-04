require('dotenv').config({
    path: '../.env'
});

import {ExpressApp} from "./core/ExpressApp";
import {ControllerInitializer} from "./ControllerInitializer";

var initializer = new ControllerInitializer();
initializer.initialize()
    .then(function() {
        var app = new ExpressApp();
        app.start();
    });
