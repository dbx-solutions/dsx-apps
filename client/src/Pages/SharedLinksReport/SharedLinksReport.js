import { useState, useEffect } from 'react';
import { Layout } from 'Pages/Layout/Layout';
import { ApiRoutes } from 'Utils/Router/ApiRoutes';
import { Button } from 'Components/Elements/Button/Button';
import { Icon } from 'Components/Elements/Icon';
import styles from './SharedLinksReport.module.css';

export function SharedLinksReport() {
	const [teamMembersList, setTeamMembersList] = useState([]);
	const [memberSharedLinksList, setMemberSharedLinksList] = useState([]);
	const [tableCaption, setTableCaption] = useState('');
	const [showEmailLink, setShowEmailLink] = useState(false);
	const [emailedMemberId, setEmailedMemberId] = useState(null);
	const [emailUrl, setEmailUrl] = useState('');

	useEffect(() => {
		getMembersList();
	}, []);

	function getMembersList() {
		fetch(ApiRoutes.teamMembersList)
			.then((res) => res.json())
			.then((data) => {
				const members = data.members.map((member) => {
					return {
						fullName: member.profile.name.given_name + ' ' + member.profile.name.surname,
						email: member.profile.email,
						teamMemberId: member.profile.team_member_id,
					};
				});
				setTeamMembersList(members);
			});
	}

	function getSharedLinks(memberName, teamMemberId) {
		fetch(
			ApiRoutes.sharedLinksList +
				new URLSearchParams({
					teamMemberId: teamMemberId,
				})
		)
			.then((res) => res.json())
			.then((data) => {
				if (data.sharedLinks.length > 0) {
					const sharedLinks = data.sharedLinks.map((link) => {
						return {
							type: link['.tag'].charAt(0).toUpperCase() + link['.tag'].slice(1),
							name: link.name,
							url: link.url,
							visibility: link.link_permissions.resolved_visibility['.tag'] === 'team_only' ? 'My team' : 'Public',
						};
					});
					setMemberSharedLinksList(sharedLinks);
					setTableCaption(`Shared links for ${memberName}`);
				} else {
					setMemberSharedLinksList([]);
					setTableCaption(`There are no shared links for ${memberName}`);
				}
			});
	}

	function emailSharedLinks(member) {
		fetch(
			ApiRoutes.sharedLinksEmail +
				new URLSearchParams({
					memberName: member.fullName,
					memberEmail: member.email,
					sharedLinksPageUrl: `${window.location.origin}/shared-links-report/${member.teamMemberId}`,
				})
		)
			.then((res) => res.json())
			.then((data) => {
				setShowEmailLink(true);
				setEmailedMemberId(member.teamMemberId);
				setEmailUrl(data.emailUrl);
			});
	}

	return (
		<Layout title="Shared Links Report">
			<div className={styles.container}>
				<h2 className={styles.tagline}>Extra security for your shared links</h2>

				<ul className={styles.membersListContainer}>
					{teamMembersList.map((member, index) => (
						<li key={`member${index}`} className={styles.memberItem}>
							<div>
								<span className={styles.memberName}>
									{index + 1}- <strong>{member.fullName}</strong> ({member.email})
								</span>
								<span className={styles.memberId}>ID: {member.teamMemberId}</span>
							</div>

							<div className={styles.memberActionsContainer}>
								<Button
									icon={Icon.template}
									caption="Show shared links"
									handleOnClick={() => getSharedLinks(member.fullName, member.teamMemberId)}
									color="gray"
								/>
								{showEmailLink & (emailedMemberId === member.teamMemberId) ? (
									<Button
										icon={Icon.link}
										caption="Open email"
										handleOnClick={() => window.open(emailUrl)}
										color="blue"
									/>
								) : (
									<Button
										icon={Icon.link}
										caption="Email shared links"
										handleOnClick={() => emailSharedLinks(member)}
										color="gray"
									/>
								)}
							</div>
						</li>
					))}
				</ul>

				<div className={styles.linksTableContainer}>
					<h5 className={styles.tableCaption}>{tableCaption}</h5>
					{memberSharedLinksList.length != 0 && (
						<table>
							<thead>
								<tr>
									<th>#</th>
									<th>Type</th>
									<th>Name</th>
									<th>Visibility</th>
								</tr>
							</thead>

							<tbody>
								{memberSharedLinksList.map((link, index) => (
									<tr key={`link${index}`}>
										<td>{index + 1}</td>
										<td>{link.type}</td>
										<td>
											<a href={link.url} target="_blank" className={styles.fileFolderLink}>
												{link.name}
											</a>
										</td>
										<td>{link.visibility}</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>
			</div>
		</Layout>
	);
}
