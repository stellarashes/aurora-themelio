import {ControllerContext} from "./ControllerContext";

export class ActionExecutingContext extends ControllerContext {
    public actionParameters: any[];
    public cancelAction: boolean;
}