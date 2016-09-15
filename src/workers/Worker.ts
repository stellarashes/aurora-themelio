export abstract class Worker<T> {
    private sleep: number;

    /**
     * Number in milliseconds to delay between consecutive invocations of get when there are no items that are returned
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

    public getItems(): T[] {
        return null;
    }

    public abstract async work(item: T): Promise<any>;

    public async run(): Promise<any> {
        while(true) {
            await this.runStep();
        }
    }

    private async runStep(): Promise<any> {
        let items = this.getItems();
        if (!items || !Array.isArray(items) || items.length === 0) {
            return Worker.delay(this.sleep);
        }

        return Promise.all(items.map(x => this.work(x)));
    }

    private static async delay(milliseconds: number) {
        return new Promise<void>(resolve => {
            setTimeout(resolve, milliseconds);
        });
    }
}
