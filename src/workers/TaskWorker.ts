import {Queue} from "../queues/Queue";
export abstract class TaskWorker<T> {
    private sleep: number;
    private queue: Queue<T>;

    /**
     * Number in milliseconds to delay between consecutive invocations of get when there are no items that are returned, or delay between invocation with no queue set
     * @param sleep
     * @param queue
     */
    public constructor(sleep: number, queue?: Queue<T>) {
        this.sleep = sleep;
        this.queue = queue;
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

    public async run() {
        if (!this.queue) {
            console.warn('Worker ' + this.constructor.name + ' has no queue to read from');
        }
        while(true) {
            await this.runTask();
        }
    }

    private async runTask(): Promise<any> {
        if (this.queue) {
            let item = await this.queue.dequeue();
            if (item) {
                try {
                    let result = await this.work(item);
                    return Promise.resolve(result);
                } catch (e) {
                    this.queue.enqueue(item);
                    return Promise.resolve(e);
                }
            }
        } else {
            await this.work(null);
        }

        return TaskWorker.delay(this.sleep);
    }

    private static async delay(milliseconds: number) {
        return new Promise<void>(resolve => {
            setTimeout(resolve, milliseconds);
        });
    }
}
