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
			const dbx = createDbxAsUser(authToken.toString(), teamMemberId);
			listSharedLinks(dbx).then((sharedLinks) => {
				res.json({ sharedLinks: sharedLinks });
			});
		});
	});

	app.get(routes.sharedLinksEmail, (req, res) => {
		const { memberName, memberEmail, sharedLinksPageUrl } = req.query;
		sendEmail(memberName, memberEmail, sharedLinksPageUrl).then((url) => res.json({ emailUrl: url }));
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

async function sendEmail(name, email, sharedLinksPageUrl) {
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

	let info = await transporter.sendMail({
		from: 'Dropbox Solutions Accelerator<hussam@dropbox.com>',
		to: email,
		subject: 'Check out your Dropbox shared links',
		html: `<p>Hi ${name}, please check this list of you Dropbox shared links and make sure you only share the needed information with our external teams. Thanks!</p>
		<a href=${sharedLinksPageUrl}>Shared Links</a>`,
	});

	return nodemailer.getTestMessageUrl(info);
}

export function run() {
	app.listen(8080);
}
