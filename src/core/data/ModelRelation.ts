import {DataModel} from "./DataModel";
export interface ModelRelation {
    source?: Function;
    property?: string;
    target?: typeof DataModel;
    params?: any;
    type?: string;
    eager?: boolean;
}