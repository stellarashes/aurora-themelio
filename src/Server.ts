import {Application} from "express";
import {ExpressApp} from "./core/ExpressApp";
import {Initializer} from "./Initializer";
import {ActionFilter} from "./filters/ActionFilter";

export class Server {
	private static app: ExpressApp;

	public static async init(params?: ServerOptions) {
		await Initializer.run();

		try {
			Server.app = new ExpressApp();
			Server.app.init(params);
		} catch (e) {
			console.error(e);
			throw e;
		}
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
	middlewares: any[],
	globalFilters: ActionFilter[],
}
