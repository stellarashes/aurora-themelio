import {GET} from "../decorators/HTTPVerbs";
import {Path} from "../decorators/Path";
import {CBOAuthService} from "../services/CBOAuthService";
import {Inject, AutoWired} from "typescript-ioc";

@AutoWired
@Path('/member/recs')
export class JobRecsIdealController {
    @Inject private oauth: CBOAuthService;

    @Path('/:memberDID') @GET
    public async recommendationsByMember(memberDID: string) {
        return new Promise<string>(resolve => {
            resolve('test');
        });
    }

    @Path('/info/:memberDID') @GET
    public async testInfo(memberDID: string) {
        return this.oauth.get('/member/' + memberDID);
    }
}
