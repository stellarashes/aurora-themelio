
import {getModelAttributes} from "../../decorators/models/model-decorators";
import {CreateOptions, Model, Promise, FindOptions} from "sequelize";
import {getModelRelations} from "../../decorators/models/relations";
import {ModelRelation} from "./ModelRelation";

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

    static create(values?: Object, options?: CreateOptions) {
        options = this.addIncludesToOptions(options, x => values.hasOwnProperty(x.property));
        return super.create(values, options);
    }

    static findAll(options?: FindOptions) {
        options = this.addIncludesToOptions(options, x => x.eager);
        return super.findAll(options);
    }

    private static addIncludesToOptions(options: FindOptions | CreateOptions, addIncludeDelegate?: ShouldAddInclude) {
        if (!addIncludeDelegate) {
            addIncludeDelegate = x => true;
        }
        let relations = getModelRelations(this);
        let shouldCheckForInclude = (!options || !options.include) && relations.length > 0;
        if (shouldCheckForInclude) {
            let createIncludes = [];
            for (let relation of relations) {
                if (addIncludeDelegate(relation)) {
                    createIncludes.push({
                        model: relation.target,
                        as: relation.property
                    });
                }
            }

            if (createIncludes.length > 0) {
                options = options || {};
                options.include = createIncludes;
            }
        }

        return options;
    }
}

interface ShouldAddInclude {
    (relation: ModelRelation): boolean;
}