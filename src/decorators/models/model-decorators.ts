import {ModelAttributeColumnOptions, ModelOptions, ModelAttributes} from "sequelize";
import {Database} from "../../core/data/Database";
import {DataModel} from "../../core/data/DataModel";
import {SiteConfig} from "../../SiteConfig";
import snakeCase = require("snake-case");
import {ColumnModifications} from "../../core/data/ColumnModifications";
import {DataTypes} from "sequelize";

const columnMetaKey = Symbol('data:property-attributes');

export function Column(options?: ModelAttributeColumnOptions) {
    return function (target: any, key: string) {
        options = ColumnModifications.modifyColumnOptions(options, target, key);

        let columnOptions = getModelAttributes(target) || {};
        columnOptions[key] = options;
        Reflect.defineMetadata(columnMetaKey, columnOptions, target);
    }
}


export function Table(options?: ModelOptions) {
    return function (target: typeof DataModel) {
        let columnOptions: ModelAttributes = getModelAttributes(target.prototype) || {};
        if (options && options.underscored) {
            let columnOptionsSnakeCased: ModelAttributes = {};
            for (let key in columnOptions) {
                if (columnOptions.hasOwnProperty(key)) {
                    let snakeCaseKey = snakeCase(key);
                    columnOptionsSnakeCased[snakeCaseKey] = columnOptions[key];
                }
            }

            columnOptions = columnOptionsSnakeCased;
        }
        columnOptions = addPKIfMissingAndEnabled(columnOptions);
        Reflect.defineMetadata(columnMetaKey, columnOptions, target.prototype);
        Database.defineType(target, options || {}, columnOptions);
    };
}

export function getModelAttributes(source) {
    return Reflect.getMetadata(columnMetaKey, source);
}

function addPKIfMissingAndEnabled(columnOptions: ModelAttributes) {
    if (SiteConfig.DatabaseModelDefaultPK) {
        let hasPK = false;
        for (let key in columnOptions) {
            let option: any = columnOptions[key];
            if (option && option.primaryKey) {
                hasPK = true;
                break;
            }
        }

        if (!hasPK) {
            let optionsWithPK = {};
            optionsWithPK[SiteConfig.DatabaseDefaultPKName] = SiteConfig.DatabaseDefaultPKOptions;
            return Object.assign(optionsWithPK, columnOptions);
        }
    }

    return columnOptions;
}
