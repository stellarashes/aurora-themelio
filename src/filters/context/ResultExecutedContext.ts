import {ControllerContext} from "./ControllerContext";
import {ResultExecutingContext} from "./ResultExecutingContext";
export class ResultExecutedContext extends ControllerContext {
    public outputResult: any;
    public cacheKey: string;

    constructor(executingContext: ResultExecutingContext, outputResult: any, cacheKey: string) {
        super(executingContext);
        this.outputResult = outputResult;
        this.cacheKey = cacheKey;
    }
}