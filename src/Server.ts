import {Application} from "express";
import {ExpressApp} from "./core/ExpressApp";
import {Initializer} from "./Initializer";

export class Server {
	private static app: ExpressApp;

	public static async init() {
		await Initializer.run();
		Server.app = new ExpressApp();
		Server.app.init();
	}

	public static async start() {
		await Server.init();
		Server.app.start();
	}

	public static getApp(): Application {
		return Server.app.getExpressApp();
	}
}
