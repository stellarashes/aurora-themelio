export interface Queue<T> {
    enqueue(object: T): Promise<T>;
    dequeue(): Promise<T>;
    complete(object: T): Promise<any>;
    error(object: T): Promise<any>;
}