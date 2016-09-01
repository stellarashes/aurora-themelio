import {AutoWired, Inject} from "typescript-ioc";
import {CBOAuthService} from "./CBOAuthService";
@AutoWired
export class MemberDataService {
    @Inject private oauth: CBOAuthService;

    public async getMemberClassifications(memberDID: string) {
        return this.oauth.get('/consumer/talentnetwork/member/classification/' + memberDID);
    }

    public async getMemberInfo(memberDID: string) {
        return this.oauth.get('/consumer/talentnetwork/member/' + memberDID);
    }
}