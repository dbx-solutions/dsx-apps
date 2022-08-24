import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from 'Pages/Layout/Layout';
import { ApiRoutes } from 'Utils/Router/ApiRoutes';
import styles from './SharedLinksReport.module.css';

export function SharedLinksReportForMember() {
	const [memberSharedLinksList, setMemberSharedLinksList] = useState([]);
	const [tableCaption, setTableCaption] = useState('');
	const { team_member_id } = useParams();

	useEffect(() => {
		getSharedLinksForMember();
	}, []);

	function getSharedLinksForMember() {
		fetch(
			ApiRoutes.sharedLinksList +
				new URLSearchParams({
					teamMemberId: team_member_id,
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
					setTableCaption('My shared links');
				} else {
					setMemberSharedLinksList([]);
					setTableCaption(`I don't have shared links yet`);
				}
			});
	}

	return (
		<Layout title="Shared Links Report">
			<div className={styles.container}>
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
