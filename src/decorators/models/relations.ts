import {DataModel} from "../../core/data/DataModel";
import {HasOneOptions} from "~sequelize/lib/associations/has-one";
import {HasManyOptions} from "~sequelize/lib/associations/has-many";
import {DatabaseConnector} from "../../core/data/DatabaseConnector";
import {ModelRelation} from "../../core/data/ModelRelation";
import {BelongsToManyOptions} from "~sequelize/lib/associations/belongs-to-many";

const relationMetaKey = Symbol('data:relations');

export function HasOne(targetModel: typeof DataModel, params?: HasOneOptions) {
    return hasAssociation('hasOne', targetModel, params);
}

export function HasMany(targetModel: typeof DataModel, params?: HasManyOptions) {
    return hasAssociation('hasMany', targetModel, params);
}

function hasAssociation(type: string, targetModel: typeof DataModel, params: HasOneOptions | HasManyOptions | BelongsToManyOptions) {
    return function (target: DataModel, key: string) {
        params = setDefaultParams(params, key);
        let relation = {
            source: target.constructor,
            target: targetModel,
            property: key,
            params: params,
            type: type
        };
        updateRelation(relation.source, relation);
        DatabaseConnector.addRelation(relation);
    };
}

function setDefaultParams(params: HasOneOptions | HasManyOptions, key: string) {
    params = params || {};
    if (!params['as']) {
        params['as'] = key;
    }
    return params;
}

export function getModelRelations(target: any): ModelRelation[] {
    return Reflect.getMetadata(relationMetaKey, target) || [];
}

function saveModelRelations(target: any, relations: ModelRelation[]) {
    return Reflect.defineMetadata(relationMetaKey, relations, target);
}

function updateRelation(target: any, relation: ModelRelation) {
    let relations = getModelRelations(target);
    let destRelation = relations.find(x => x.property === relation.property);
    if (destRelation) {
        Object.assign(destRelation, relation);
    } else {
        relations.push(relation);
    }
    saveModelRelations(target, relations);
}

export function Eager(target: DataModel, key: string) {
    let relation = {
        property: key,
        eager: true
    };
    updateRelation(target.constructor, relation);
}

export function BelongsToMany(targetModel: typeof DataModel, options: BelongsToManyOptions) {
    return hasAssociation('belongsToMany', targetModel, options);
}