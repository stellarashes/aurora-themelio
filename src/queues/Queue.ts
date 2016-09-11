export interface Queue<T> {
    enqueue(object: T, enabledTime?: Date): Promise<T>;
    dequeue(): Promise<T>;
    complete(object: T): Promise<any>;
    error(object: T): Promise<any>;
}