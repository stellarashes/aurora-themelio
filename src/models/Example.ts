import {DataModel} from "../core/data/DataModel";
import {DataTypes} from "sequelize";
import {Table, Column} from "../decorators/models/model-decorators";

@Table()
export class Example extends DataModel {
    @Column({
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    })
    id: number;

    @Column()
    email: string;
}