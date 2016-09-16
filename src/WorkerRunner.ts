import {TaskWorker} from "./workers/TaskWorker";
import {Initializer} from "./Initializer";
export class WorkerRunner {
    public static async start(workerTypes: (typeof TaskWorker)[]) {
        await Initializer.run();

        for (let workerType of workerTypes) {
            let concurrency = workerType.getConcurrency();
            for (let i = 0; i < concurrency; i++) {
                let instance = Reflect.construct(workerType, []);
                instance.run();
            }
        }
    }
}