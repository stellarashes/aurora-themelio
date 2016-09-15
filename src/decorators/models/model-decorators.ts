import {DataTypes, ModelAttributeColumnOptions, ModelOptions, ModelAttributes} from "sequelize";
import {DatabaseConnector} from "../../core/data/DatabaseConnector";
import {DataModel} from "../../core/data/DataModel";
import {SiteConfig} from "../../SiteConfig";

const columnMetaKey = Symbol('data:property-attributes');
const typeMetaKey = 'design:type';

export function Column(options?: string | DataTypes.DataType | ModelAttributeColumnOptions) {
    return function (target: any, key: string) {
        if (!options) {
            let propertyType = Reflect.getMetadata(typeMetaKey, target, key);
            options = getDataTypeByPropertyType(target, key, propertyType);
        }

        let columnOptions = getModelAttributes(target) || {};
        columnOptions[key] = options;
        Reflect.defineMetadata(columnMetaKey, columnOptions, target);
    }
}

let propertyTypeMapping = {
    "String": DataTypes.STRING,
    "Number": DataTypes.INTEGER,
    "Date": DataTypes.DATE,
};

function getDataTypeByPropertyType(target, key, propertyType) {
    let name;
    if (propertyType && (name = propertyType.name)) {
        if (propertyTypeMapping.hasOwnProperty(name)) {
            return propertyTypeMapping[name];
        }
    }
    throw new Error('Could not automatically determine the type of ' + target + '.' + key + ' (' + propertyType.name + ')');
}

export function Table(options?: ModelOptions) {
    return function (target: typeof DataModel) {
        let columnOptions: ModelAttributes = getModelAttributes(target.prototype) || {};
        columnOptions = addPKIfMissingAndEnabled(columnOptions);
        Reflect.defineMetadata(columnMetaKey, columnOptions, target.prototype);
        DatabaseConnector.defineType(target, options || {}, columnOptions);
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
            columnOptions[SiteConfig.DatabaseDefaultPKName] = SiteConfig.DatabaseDefaultPKOptions;
        }
    }

    return columnOptions;
}
