import {Queue} from "./Queue";
import {DataModel} from "../core/data/DataModel";
import {DataTypes} from "sequelize";
import {SimpleDatabaseQueue} from "./SimpleDatabaseQueue";

export class ObjectDatabaseQueue<T extends DataModel> implements Queue<T> {
    private type: typeof DataModel;
    private keyQueue: SimpleDatabaseQueue;

    public constructor(type: typeof DataModel, queueName: string, retries: number = 0) {
        this.type = type;
        this.keyQueue = new SimpleDatabaseQueue(queueName, retries);
    }

    public async enqueue(object: T, enabledTime?: Date): Promise<T> {
        return this.keyQueue.enqueue(object.getPKValue(), enabledTime)
            .then(function() {
                return object;
            });
    }

    public async dequeue(): Promise<T> {
        return this.keyQueue.dequeue()
            .then(function (targetId) {
                let search = {};
                search[this.type.getPKName()] = targetId;

                return this.type.findOne({where: search});
            });
    }

    public async complete(object: T): Promise<any> {
        return this.keyQueue.complete(object.getPKValue());
    }

    public async error(object: T): Promise<any> {
        return this.keyQueue.error(object.getPKValue());
    }

}
