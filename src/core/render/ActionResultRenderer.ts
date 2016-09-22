import {ActionExecutingContext} from "../../filters/context/ActionExecutingContext";
import {ArgumentError} from "../exceptions/ArgumentError";

/**
 * Default renderer for action result; will simply JSON.stringify result
 * To override this behavior, extend this class and bind this class to a different implementation with IoC
 */
export class ActionResultRenderer {
    public doRender(context: ActionExecutingContext) {
        if (context.error) {
            if (context.error instanceof ArgumentError) {
                context.httpContext.response.status(400).end({error: context.error.message});
            } else {
                context.httpContext.response.status(500).end();
            }
        } else {
            context.httpContext.response.json(context.result);
        }
    }
}