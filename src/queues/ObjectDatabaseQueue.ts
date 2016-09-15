import {Queue} from "./Queue";
import {DataModel} from "../core/data/DataModel";
import {SimpleDatabaseQueue} from "./SimpleDatabaseQueue";

export class ObjectDatabaseQueue<T extends DataModel> implements Queue<T> {
    private type: typeof DataModel;
    private keyQueue: SimpleDatabaseQueue;

    public constructor(type: typeof DataModel, queueName: string, retries: number = 0) {
        this.type = type;
        this.keyQueue = new SimpleDatabaseQueue(queueName, retries);
    }

    public async enqueue(object: T, enabledTime?: Date): Promise<T> {
        return this.keyQueue.enqueue(JSON.stringify(object.getPKValues()), enabledTime)
            .then(function() {
                return object;
            });
    }

    public async dequeue(): Promise<T> {
        return this.keyQueue.dequeue()
            .then(function (targetId) {
                let search = this.type.getPKValuesFromObject(JSON.stringify(targetId));

                return this.type.findOne({where: search});
            });
    }

    public async complete(object: T): Promise<any> {
        return this.keyQueue.complete(JSON.stringify(object.getPKValues()));
    }

    public async error(object: T): Promise<any> {
        return this.keyQueue.error(JSON.stringify(object.getPKValues()));
    }

}
