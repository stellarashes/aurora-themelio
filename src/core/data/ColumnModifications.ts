import {DataTypes} from "sequelize";
import {SiteConfig} from "../../SiteConfig";
import {ModelAttributeColumnOptions} from "~sequelize/lib/model";

const typeMetaKey = 'design:type';

export class ColumnModifications {
	public static modifyColumnOptions(options: ModelAttributeColumnOptions, target: any, key: string) {
		let copy = Object.assign({}, options);
		if (!copy || !copy.type) {
			let propertyType = Reflect.getMetadata(typeMetaKey, target, key);
			let defaultType = getDataTypeByPropertyType(target, key, propertyType);
			if (!copy) {
				copy = {
					type: defaultType
				};
			} else {
				copy.type = getDataTypeByPropertyType(target, key, propertyType);
			}
		}

		if (SiteConfig.DatabaseColumnDefaultNotNull && (!copy || typeof(copy.allowNull) === 'undefined')) {
			copy.allowNull = false;
		}

		return copy;
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
