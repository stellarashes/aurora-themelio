import {Request} from "express";
import {Response} from "express";
export class RouteHandler {
    private controller: Function;
    private handler: string;
    private parameters: ParamInfo[] = [];

    constructor(controllerConstructor: Function, handler: string) {
        this.controller = controllerConstructor;
        this.handler = handler;

        this.populateParameters();
    }

    public async handleRequest(req: Request, res: Response, next: Function) {
        let instance = Reflect.construct(this.controller, []);
        let handler = instance[this.handler];


        console.log(req.query);
        let outputValue = await handler.call(instance);
        res.end(outputValue);
        next();
    }

    private populateParameters() {
        let metadata = Reflect.getMetadata('design:paramtypes', this.controller.prototype, this.handler);
        let names = getParameterNames(this.controller.prototype[this.handler]);

        for (let i = 0; i < names.length; i++) {
            let info = {
                name: names[i],
                type: metadata[i],
            };
            this.parameters.push(info);
        }
    }
}

interface ParamInfo {
    name: string,
    type: any
}

let STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg;
let ARGUMENT_NAMES = /([^\s,]+)/g;

function getParameterNames(func: Function) {
    let fnStr = func.toString().replace(STRIP_COMMENTS, '');
    let result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if(result === null)
        result = [];
    return result;
}