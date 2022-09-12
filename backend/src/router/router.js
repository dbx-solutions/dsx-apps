import express from 'express';
import fs from 'fs';
import { routes } from './routes.js';
import * as config from './config.js';
import templates from '../../templates/templates.js';
import { getAuthTokenFromCode, getAuthUrl, storeAuthToken } from '../auth/auth.js';
import { createStructureFromTemplate } from '../../src/structure/structure.js';
import { listTemplates } from '../../src/template/template.js';
import { listMembers } from '../../node_modules/dsx-core/src/resources/dropbox/team/member/member.js';
import { listSharedLinks } from '../../node_modules/dsx-core/src/resources/dropbox/user/sharedLinks/sharedLinks.js';
import { createDbxAsTeam, createDbxAsUser } from '../../node_modules/dsx-core/src/util/dbx/dbx.js';
import nodemailer from 'nodemailer';

const app = express();
// middleware
app.use(express.json());
app.use(express.urlencoded());

export function createRoutes() {
	app.get(routes.authUrl, (req, res) => {
		getAuthUrl()
			.then((authUrl) => {
				res.json({ authUrl: authUrl });
			})
			.catch((error) => console.error(error.message));
	});

	app.get(routes.authToken, (req, res) => {
		const { code } = req.query;

		getAuthTokenFromCode(code)
			.then((authTokenResponse) => {
				storeAuthToken(authTokenResponse.result.access_token);
				res.end();
			})
			.catch((error) => console.error(error.message));
	});

	app.get(routes.templateList, (req, res) => {
		res.json({ templateList: listTemplates() });
	});

	app.get(routes.structureCreate, (req, res) => {
		const { templateName, rootName } = req.query;

		fs.readFile('token.txt', 'utf8', function (err, authToken) {
			createStructureFromTemplate(templates[templateName], rootName, authToken.toString(), config.USER_ID);
		});
	});

	app.get(routes.membersList, (req, res) => {
		fs.readFile('token.txt', 'utf8', function (err, authToken) {
			const dbx = createDbxAsTeam(authToken.toString());
			listMembers(dbx).then((members) => {
				res.json({ members: members });
			});
		});
	});

	app.get(routes.sharedLinksList, (req, res) => {
		const { teamMemberId } = req.query;

		fs.readFile('token.txt', 'utf8', function (err, authToken) {
			getMemberSharedLinks(authToken, teamMemberId).then((sharedLinks) => {
				res.json({ sharedLinks: sharedLinks });
			});
		});
	});

	app.post(routes.sharedLinksEmail, (req, res) => {
		const { teamMemberId, memberGivenName, memberEmail, memberSharedLinksPageUrl } = req.body;

		fs.readFile('token.txt', 'utf8', function (err, authToken) {
			getMemberSharedLinks(authToken, teamMemberId).then((memberSharedLinks) => {
				sendEmail(memberGivenName, memberEmail, memberSharedLinks, memberSharedLinksPageUrl).then((url) =>
					res.json({ emailUrl: url })
				);
			});
		});
	});

	app.get('/check-auth', (req, res) => {
		try {
			if (fs.existsSync('./token.txt')) {
				res.json({ exists: true });
			}
		} catch (err) {
			res.json({ exists: err });
		}
	});
}

async function getMemberSharedLinks(authToken, teamMemberId) {
	const dbx = createDbxAsUser(authToken.toString(), teamMemberId);

	return listSharedLinks(dbx).then((sharedLinksData) => {
		return sharedLinksData.map((link) => {
			return {
				type: link['.tag'].charAt(0).toUpperCase() + link['.tag'].slice(1),
				name: link.name,
				url: link.url,
				visibility: link.link_permissions.resolved_visibility['.tag'] === 'team_only' ? 'My team' : 'Public',
				createdAt: new Date(link.server_modified),
			};
		});
	});
}

async function sendEmail(name, email, sharedLinks, sharedLinksPageUrl) {
	let testAccount = await nodemailer.createTestAccount();

	let transporter = nodemailer.createTransport({
		host: 'smtp.ethereal.email',
		port: 587,
		secure: false,
		auth: {
			user: testAccount.user,
			pass: testAccount.pass,
		},
	});

	const htmlOpeningText = `<p>Hi ${name},</p><p>To achieve a higher level of security for our data, please review your list of shared links and make sure you only share the needed information with our external teams.</p><br />`;
	const htmlTableOpeningTag = `<table>`;
	const htmlTableHead = `
		<thead>
			<tr>
				<th>#</th>
				<th>Type</th>
				<th>Name</th>
				<th>Visibility</th>
				<th>Created at</th>
			</tr>
		</thead>`;
	const htmlTableBodyOpeningTag = `<tbody>`;
	const htmlTableRows = sharedLinks.map((link, index) => {
		return `<tr>
				<td>${index + 1}</td>
				<td>${link.type}</td>
				<td>
					<a href=${link.url} target="_blank">
						${link.name}
					</a>
				</td>
				<td>${link.visibility}</td>
				<td>
					${link.type === 'Folder' ? 'Not specified' : `${link.createdAt.toLocaleString('default', { dateStyle: 'medium' })}`}
				</td>
			</tr>`;
	});
	const htmlTableBodyClosingTag = `</tbody>`;
	const htmlTableClosingTag = `</table>`;
	const htmlExtraText = `<br /><p>You can also check them on this page: <a href=${sharedLinksPageUrl}>Show my shared Links</a></p>`;
	const htmlClosingText = `<p>Many thanks! <br />Your IT Team!</p>`;
	const htmlPage =
		htmlOpeningText +
		htmlTableOpeningTag +
		htmlTableHead +
		htmlTableBodyOpeningTag +
		htmlTableRows.join('') +
		htmlTableBodyClosingTag +
		htmlTableClosingTag +
		htmlExtraText +
		htmlClosingText;

	let info = await transporter.sendMail({
		from: 'Dropbox Solutions Accelerator<hussam@dropbox.com>',
		to: email,
		subject: 'Check out your Dropbox shared links',
		html: htmlPage.replace(/^\s+|\s+$/g, ''),
	});

	return nodemailer.getTestMessageUrl(info);
}

export function run() {
	app.listen(8080);
}
