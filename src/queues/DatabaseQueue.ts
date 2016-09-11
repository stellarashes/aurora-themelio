import {Queue} from "./Queue";
import {Table, Column} from "../decorators/models/model-decorators";
import {DataModel} from "../core/data/DataModel";
import {DataTypes} from "sequelize";

export class DatabaseQueue<T extends DataModel> implements Queue<T> {

    private queueName: string;
    private retries: number;
    private type: typeof DataModel;

    public constructor(type: typeof DataModel, queueName: string, retries: number = 0) {
        this.queueName = queueName;
        this.retries = retries;
        this.type = type;
    }

    public async enqueue(object: T, enabledTime?: Date): Promise<T> {
        return DBQueue.create({
            targetId: object.getPKValue(),
            startTime: enabledTime || new Date(),
            queueName: this.queueName,
            status: 'pending',
            retries: this.retries,
        }).then(function () {
            return object;
        });
    }

    public async dequeue(): Promise<T> {
        let now = new Date();
        return DBQueue.findOne({
            where: {
                queueName: this.queueName,
                status: 'pending',
                startTime: {
                    $le: now
                }
            },
            order: ['updatedAt']
        }).then(function (result) {
            let queueItem = <DBQueue>result;
            let search = {};
            search[this.type.getPKName()] = queueItem.targetId;
            return this.type.findOne({
                where: search
            });
        }).then(function (result) {
            return <T>result;
        });
    }

    public async complete(object: T): Promise<any> {
        let keyValue = object.getPKValue();
        return DBQueue.update({
            status: 'completed'
        }, {
            where: {
                targetId: keyValue
            }
        });
    }

    public async error(object: T): Promise<any> {
        return DBQueue.findOne({
            where: {
                targetId: object.getPKValue()
            }
        }).then(function (result) {
            let queueItem = <DBQueue>result;
            if (--queueItem.retries < 0) {
                queueItem.status = 'error';
            }

            return queueItem.save();
        });
    }

}

@Table()
export class DBQueue extends DataModel {
    @Column()
    targetId: string;

    @Column()
    startTime: Date;

    @Column()
    queueName: string;

    @Column({
        type: DataTypes.ENUM('pending', 'completed', 'error')
    })
    status: string;

    @Column()
    retries: number;
}