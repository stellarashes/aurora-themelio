import {GET} from "../decorators/HTTPVerbs";
import {Path} from "../decorators/Path";
import {CBOAuthService} from "../services/CBOAuthService";
import {Inject} from "typescript-ioc";

@Path('/member/recs')
export class JobRecsIdealController {
    @Inject private oauth: CBOAuthService;

    @Path('/:memberDID') @GET
    public async recommendationsByMember(
        memberDID: number, // abc
        tnDID: string
    ) {
        return new Promise<string>(resolve => {
            resolve('test');
        });
    }

}