import {Queue} from "./Queue";
import {Table, Column} from "../decorators/models/model-decorators";
import {DataModel} from "../core/data/DataModel";
import {DataTypes} from "sequelize";

export class SimpleDatabaseQueue implements Queue<string> {
    private queueName: string;
    private retries: number;

    public constructor(queueName: string, retries: number) {
        this.queueName = queueName;
        this.retries = retries;
    }

    public async enqueue(object: string, enabledTime?: Date): Promise<string> {
        return DBQueue.create({
            targetId: object,
            startTime: enabledTime || new Date(),
            queueName: this.queueName,
            status: 'pending',
            retries: this.retries,
        }).then(function () {
            return object;
        });
    }

    public async dequeue(): Promise<string> {
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
            return queueItem.targetId;
        });
    }

    public async complete(object: string): Promise<any> {
        return DBQueue.update({
            status: 'completed'
        }, {
            where: {
                targetId: object
            }
        });
    }

    public async error(object: string): Promise<any> {
        return DBQueue.findOne({
            where: {
                targetId: object
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