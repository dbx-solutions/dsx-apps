import { React } from 'react';
import { Layout } from 'Pages/Layout/Layout';
import { Icon } from 'Components/Elements/Icon';
import styles from './main.module.css';
import { OAuth } from 'Utils/Auth/OAuth';

export function Main() {
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
					<span className={styles.formTagline}>Connect your Dropbox Team</span>
					<OAuth />
				</div>
			</div>
		</Layout>
	);
}
