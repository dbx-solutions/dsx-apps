import { React } from 'react';
import { Icon } from 'Components/Elements/Icon';
import styles from './nav.module.css';

export function Nav() {
	return (
		<>
			<div className={styles.leftSide}>
				<a href="/" className={styles.logoArea}>
					<span className={styles.logo}> {Icon.logo}</span>
					<span className={styles.projectName}>Solutions Accelerator</span>
				</a>
				<span className={styles.beta}>Beta</span>
			</div>

			<div className={styles.rightSide}>
				<div className={styles.rightSide}>
					<a href="/folder-templates" className={styles.navLink}>
						Folder Templates
					</a>
					<a href="/shared-links-report" className={styles.navLink}>
						Shared Links Report
					</a>
				</div>

				<div className={styles.divider}></div>

				<a href="https://dbx-solutions.github.io/dsx/" target="_blank" className={styles.navLink}>
					Documentation
				</a>
				<a href="https://github.com/dbx-solutions" target="_blank" className={styles.navLink}>
					Source Code
				</a>
			</div>
		</>
	);
}
