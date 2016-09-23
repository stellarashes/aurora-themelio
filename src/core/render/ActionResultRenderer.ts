import {ArgumentError} from "../exceptions/ArgumentError";
import {ResultExecutingContext} from "../../filters/context/ResultExecutingContext";

/**
 * Default renderer for action result; will simply JSON.stringify result
 * To override this behavior, extend this class and bind this class to a different implementation with IoC
 */
export class ActionResultRenderer {
    public async doRender(context: ResultExecutingContext): Promise<string> {
        if (context.error) {
            if (context.error instanceof ArgumentError) {
                var value = {error: context.error.message};
                context.httpContext.response.status(400).json(value);
                return Promise.resolve(JSON.stringify(value));
            } else {
                context.httpContext.response.status(500).end();
                return Promise.resolve('');
            }
        } else {
            context.httpContext.response.json(context.result);
            return Promise.resolve(JSON.stringify(context.result));
        }
    }
}