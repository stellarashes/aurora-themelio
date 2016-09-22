import {Request, Response} from "express";

export class HttpContext {
    public request: Request;
    public response: Response;
}