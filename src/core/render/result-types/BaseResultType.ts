import {HttpContext} from "../../HttpContext";
export class BaseResultType {
    protected result: any;

    constructor(result: any) {
        this.result = result;
    }

    public render(context: HttpContext) {
        context.response.json(this.result);
    }
}