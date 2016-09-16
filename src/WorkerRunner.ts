import {TaskWorker} from "./workers/TaskWorker";
import {Initializer} from "./Initializer";
export class WorkerRunner {
    public static async start(workers: TaskWorker<any>[]) {
        await Initializer.run();
        for (let worker of workers) {
            worker.run();
        }
    }
}