
import {Model} from "sequelize";
import {getModelAttributes} from "../../decorators/models/model-decorators";

export class DataModel extends Model {

    public static getPKName(): string {
        let attributes = getModelAttributes(this);
        for (let [key, value] of attributes) {
            if (value && value.primaryKey) {
                return key;
            }
        }

        return null;
    }

    public getPKValue(): any {
        let name = DataModel.getPKName();
        if (name) {
            return this[name];
        }
        return null;
    }
}