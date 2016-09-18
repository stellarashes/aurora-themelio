import {TaskWorker} from "./workers/TaskWorker";
import {Initializer} from "./Initializer";
export class WorkerRunner {
    public static async start<T, U extends TaskWorker<T>>(workers: U[]) {
        await Initializer.run();

        for (let worker of workers) {
            let concurrency = worker.getConcurrency();
            for (let i = 0; i < concurrency; i++) {
                worker.run();
            }
        }
    }
}