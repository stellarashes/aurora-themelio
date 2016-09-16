import {Queue} from "./Queue";
export class MemoryQueue<T> implements Queue<T> {
    private items: T[] = [];

    public async enqueue(object: T): Promise<T> {
        this.items.push(object);
        return Promise.resolve(object);
    }

    public async dequeue(): Promise<T> {
        let item = this.items.shift();
        return Promise.resolve(item);
    }

    public async complete(object: T): Promise<any> {
        return Promise.resolve();
    }

    public async error(object: T): Promise<any> {
        return Promise.resolve();
    }

}