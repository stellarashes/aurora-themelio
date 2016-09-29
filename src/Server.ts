import {Application} from "express";
import {ExpressApp} from "./core/ExpressApp";
import {Initializer} from "./Initializer";

export class Server {
	private static app: ExpressApp;

	public static async init(params?: ServerOptions) {
		await Initializer.run();
		Server.app = new ExpressApp();
		Server.app.init(params);
	}

	public static async start(params?: ServerOptions) {
		await Server.init(params);
		Server.app.start();
	}

	public static getApp(): Application {
		return Server.app.getExpressApp();
	}
}

export interface ServerOptions {
	middlewares: any[]
}
