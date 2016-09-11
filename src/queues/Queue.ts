import {DataModel} from "../core/data/DataModel";
export interface Queue<T extends DataModel> {
    enqueue(object: T, enabledTime?: Date): Promise<T>;
    dequeue(): Promise<T>;
    complete(object: T): Promise<any>;
    error(object: T): Promise<any>;
}