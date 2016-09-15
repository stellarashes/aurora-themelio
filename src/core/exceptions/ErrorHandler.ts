import {Request, Response, Application} from "express";
import {ArgumentError} from "./ArgumentError";

export class ErrorHandler {
    public handleError(e: Error, req: Request, res: Response) {
        if (e instanceof ArgumentError) {
            res.status(400).end({error: e.message});
        } else {
            res.status(500).end();
        }
    }
}