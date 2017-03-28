import {BaseResultType} from "./BaseResultType";
import {HttpContext} from "../../HttpContext";
export class RedirectReturnType extends BaseResultType {
    constructor(path: string) {
        super(path);
    }

    public render(context: HttpContext) {
        context.response.redirect(super.result);
    }
}