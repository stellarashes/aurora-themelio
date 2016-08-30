import {AutoWired} from "typescript-ioc";

@AutoWired
export class CBOAuthService {
    public async get(path: String, query: Object) {
        console.log("Do oauth call");
        return
    }
}