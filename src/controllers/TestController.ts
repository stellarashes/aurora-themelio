import {GET} from "../decorators/HTTPVerbs";
import {Path} from "../decorators/Path";
import {Cache} from "../decorators/Cache";
export class TestController {
    @Path('/') @GET
    @Cache(60)
    public test() {
        return 'test';
    }
}