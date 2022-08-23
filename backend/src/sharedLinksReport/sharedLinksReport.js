import { createDbxAsUser } from '../../node_modules/dsx-core/src/util/dbx/dbx.js';
import { listSharedLinks } from '../../node_modules/dsx-core/src/resources/dropbox/user/sharedLinks/sharedLinks.js';
import { listMembers } from '../../node_modules/dsx-core/src/resources/dropbox/team/member/member.js';

export function listSharedLinks(token, userId) {
	const dbx = createDbxAsUser(token, userId);

	console.log('------------------------------------------------------');
	console.log('Members');

	listMembers().then((members) => {
		console.log(members);
	});

	console.log('------------------------------------------------------');
}
