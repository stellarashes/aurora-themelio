import {GET} from "../decorators/HTTPVerbs";
import {Path} from "../decorators/Path";
export class TestController {
    @Path('/') @GET
    public test() {
        return 'test';
    }
}