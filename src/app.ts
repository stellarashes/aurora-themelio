require('dotenv').config({
    path: '../.env'
});

import {ExpressApp} from "./core/ExpressApp";
import {ClassScanner} from "./ClassScanner";

var initializer = new ClassScanner();
initializer.initialize()
    .then(function() {
        var app = new ExpressApp();
        app.start();
    });
