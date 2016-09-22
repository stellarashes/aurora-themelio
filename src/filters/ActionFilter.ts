import {ActionExecutingContext} from "./context/ActionExecutingContext";
export abstract class ActionFilter {
    public async onActionExecuting(context: ActionExecutingContext) {}
    public async onActionExecuted(context: ActionExecutingContext) {}
    public async onResultExecuting(context: ActionExecutingContext) {}
    public async onResultExecuted(context: ActionExecutingContext) {}
}