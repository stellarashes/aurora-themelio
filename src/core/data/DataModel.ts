
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
        options = this.addIncludesToTargetOptions(this, options, (x, v) => v.hasOwnProperty(x.property), values);
        return super.create(values, options);
    }

    static findAll(options?: FindOptions) {
        options = this.addIncludesToTargetOptions(this, options, x => x.eager);
        return super.findAll(options);
    }

    private static addIncludesToTargetOptions(target: any, options: any, addIncludeDelegate?: ShouldAddInclude, qualifyingValue?: any) {
        if (!addIncludeDelegate) {
            addIncludeDelegate = x => true;
        }
        let relations = getModelRelations(target);
        let shouldCheckForInclude = (!options || !options.include) && relations.length > 0;
        if (shouldCheckForInclude) {
            let createIncludes = [];
            for (let relation of relations) {
                if (this.relationQualifies(relation, qualifyingValue, addIncludeDelegate)) {
                    let innerOptions = {
                        model: relation.target,
                        as: relation.property
                    };
                    let innerValue = qualifyingValue ? qualifyingValue[relation.property] : null;
                    innerOptions = this.addIncludesToTargetOptions(relation.target, innerOptions, addIncludeDelegate, innerValue);
                    createIncludes.push(innerOptions);
                }
            }

            if (createIncludes.length > 0) {
                options = options || {};
                options.include = createIncludes;
            }
        }
        return options;
    }

    private static relationQualifies(relation: ModelRelation, qualifyingValue: any, delegate: ShouldAddInclude): boolean {
        if (Array.isArray(qualifyingValue)) {
            for (let item of qualifyingValue) {
                if (delegate(relation, item)) {
                    return true;    // returns true if any of the item in the array qualifies
                }
            }
        } else {
            return delegate(relation, qualifyingValue);
        }
    }
}

interface ShouldAddInclude {
    (relation: ModelRelation, qualifyValue?: any): boolean;
}