import { React, useEffect, useState } from 'react';
import { Layout } from 'Pages/Layout/Layout';
import { Icon } from 'Components/Elements/Icon';
import { OAuth } from 'Utils/Auth/OAuth';
import { ApiRoutes } from 'Utils/Router/ApiRoutes';
import styles from './main.module.css';

export function Main() {
	const [isAuth, setIsAuth] = useState(false);

	useEffect(() => {
		checkAuthFile();
	}, []);

	function checkAuthFile() {
		fetch(ApiRoutes.authFile)
			.then((res) => res.json())
			.then((data) => {
				if (data.exists) setIsAuth(true);
			});
	}

	return (
		<Layout title="Welcome to the Dropbox Solution Accelerators!">
			<h2 className={styles.tagline}>Automate all of your Dropbox workflows</h2>

			<div className={styles.container}>
				<div className={styles.leftSide}>
					<div className={styles.art}>
						<div className={styles.artItem}>{Icon.folder}</div>
						<div className={styles.artItem}>{Icon.relax}</div>
					</div>
				</div>

				<div className={styles.verticalDivider}></div>

				<div className={styles.rightSide}>
					{isAuth ? (
						<span className={styles.formTagline}>Hello team Milky Way!</span>
					) : (
						<>
							<span className={styles.formTagline}>Connect your Dropbox Team</span>
							<OAuth />
						</>
					)}
				</div>
			</div>
		</Layout>
	);
}
