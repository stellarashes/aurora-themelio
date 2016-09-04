import {ControllerInitializer} from "./ControllerInitializer";
require('dotenv').config({
    path: '../.env'
});

import {ExpressApp} from "./core/ExpressApp";

var initializer = new ControllerInitializer();
initializer.initialize()
    .then(function() {
        var app = new ExpressApp();
        app.start();
    });
