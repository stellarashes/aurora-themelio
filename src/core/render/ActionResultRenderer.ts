import {ArgumentError} from "../exceptions/ArgumentError";
import {ResultExecutingContext} from "../../filters/context/ResultExecutingContext";
import {ForbiddenError} from "../exceptions/ForbiddenError";
import {BaseResultType} from "./result-types/BaseResultType";

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
			} else if (context.error instanceof ForbiddenError) {
				context.httpContext.response.status(403).end();
			} else {
				console.error(context.error);
				console.error(context.error.stack);
				context.httpContext.response.status(500).end();
			}
			return Promise.resolve('');
		} else {
			if (context.result instanceof BaseResultType) {
				context.result.render(context.httpContext);
			} else {
				context.httpContext.response.json(context.result);
			}
			return Promise.resolve(context.result);
		}
	}
}