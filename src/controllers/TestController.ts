import {GET} from "../decorators/HTTPVerbs";
import {Path} from "../decorators/Path";
import {Cache} from "../decorators/Cache";
import {Example} from "../models/Example";
export class TestController {
    @Path('/') @GET
    @Cache(3)
    public test() {
        return 'test';
    }

    @Path('/db') @GET
    public dbTest() {
        return Example.findOne();
    }
}