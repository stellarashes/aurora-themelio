import {Request, Response, Application} from "express";
import {ArgumentError} from "./ArgumentError";

export class ErrorHandler {
	public handleError(e: Error, req: Request, res: Response) {
		console.error(e);
		console.error(e.stack);
		res.status(500).end();
	}
}