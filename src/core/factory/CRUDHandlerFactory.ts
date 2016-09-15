import {Request, Response, Application} from "express";
import {CRUDHandler} from "../CRUDHandler";
import {DataModel} from "../data/DataModel";

export class CRUDHandlerFactory {
    public getHandler(req: Request, model: typeof DataModel) {
        return new CRUDHandler(req, model);
    }
}