import {ControllerContext} from "./ControllerContext";
import {ActionExecutedContext} from "./ActionExecutedContext";
export class ResultExecutingContext extends ControllerContext {
    public result: any;

    constructor(executedContext: ActionExecutedContext) {
        super(executedContext);
        this.result = executedContext.result;
    }
}