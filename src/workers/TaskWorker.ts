import {Queue} from "../queues/Queue";
export abstract class TaskWorker<T> {
    private sleep: number;
    private queue: Queue<T>;

    /**
     * Number in milliseconds to delay between consecutive invocations of get when there are no items that are returned, or delay between invocation with no queue set
     * @param sleep
     */
    public constructor(sleep: number) {
        this.sleep = sleep;
    }

    /**
     * Get the number of concurrent things the worker should work on
     */
    public getConcurrency(): number {
        return 10;
    }

    public setQueue(queue: Queue<T>) {
        this.queue = queue;
    }

    public abstract async work(item: T): Promise<any>;

    public async run(): Promise<any> {
        if (!this.queue) {
            console.warn('Worker ' + this.constructor.name + ' has no queue to read from');
        }
        for (var i = 0; i < this.getConcurrency(); i++) {
            this.runStep();
        }
    }

    private async runStep() {
        while(true) {
            await this.runTask();
        }
    }

    private async runTask(): Promise<any> {
        if (this.queue) {
            let item = await this.queue.dequeue();
            if (item) {
                return this.work(item);
            }
        } else {
            return this.work(null);
        }

        return TaskWorker.delay(this.sleep);
    }

    private static async delay(milliseconds: number) {
        return new Promise<void>(resolve => {
            setTimeout(resolve, milliseconds);
        });
    }
}
