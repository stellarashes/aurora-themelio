import {ControllerContext} from "./ControllerContext";
import {ActionExecutingContext} from "./ActionExecutingContext";
export class ActionExecutedContext extends ControllerContext {
    public result: any;

    constructor(executingContext: ActionExecutingContext, result: any) {
        super(executingContext);
        this.result = result;
    }
}