import {DataTypes} from "sequelize";
import {SiteConfig} from "../../SiteConfig";
import {ModelAttributeColumnOptions} from "~sequelize/lib/model";

const typeMetaKey = 'design:type';

export class ColumnModifications {
	public static modifyColumnOptions(options: ModelAttributeColumnOptions, target: any, key: string) {
		if (!options || !options.type) {
			let propertyType = Reflect.getMetadata(typeMetaKey, target, key);
			let defaultType = getDataTypeByPropertyType(target, key, propertyType);
			if (!options) {
				options = {
					type: defaultType
				};
			} else {
				options.type = getDataTypeByPropertyType(target, key, propertyType);
			}
		}

		if (SiteConfig.DatabaseColumnDefaultNotNull && (!options || typeof(options.allowNull) === 'undefined')) {
			options.allowNull = false;
		}

		return options;
	}
}

let propertyTypeMapping = {
	"String": DataTypes.STRING,
	"Number": DataTypes.INTEGER,
	"Date": DataTypes.DATE,
	"Boolean": DataTypes.BOOLEAN,
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