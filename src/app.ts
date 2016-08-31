require('dotenv').config({
    path: '../.env'
});

import {JobRecsIdealController} from "./controllers/JobRecsIdealController";
import {ExpressApp} from "./core/ExpressApp";

var controller = new JobRecsIdealController();

var app = new ExpressApp();
app.start();