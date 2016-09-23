import {ActionExecutingContext} from "./context/ActionExecutingContext";
import {ActionExecutedContext} from "./context/ActionExecutedContext";
import {ResultExecutingContext} from "./context/ResultExecutingContext";
import {ResultExecutedContext} from "./context/ResultExecutedContext";
export abstract class ActionFilter {
    public async onActionExecuting(context: ActionExecutingContext): Promise<void> { return null; }
    public async onActionExecuted(context: ActionExecutedContext): Promise<void> { return null; }
    public async onResultExecuting(context: ResultExecutingContext): Promise<void> { return null; }
    public async onResultExecuted(context: ResultExecutedContext): Promise<void> { return null; }
}