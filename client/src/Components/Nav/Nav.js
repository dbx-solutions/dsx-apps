import { React } from 'react';
import OAuth from 'Utils/Auth/OAuth';
import Icon from 'Components/Elements/Icon';
import styles from './nav.module.css';

export default function Nav() {
	return (
		<>
			<div className={styles.leftSide}>
				<span className={styles.logo}> {Icon.logo}</span>

				<span className={styles.projectName}>Solutions Accelerators</span>
				<span className={styles.beta}>Beta</span>
			</div>

			<div className={styles.rightSide}>
				<a href="https://dbx-solutions.github.io/dsx/" target="_blank" className={styles.navLink}>
					Documentation
				</a>
				<a href="https://github.com/dbx-solutions" target="_blank" className={styles.navLink}>
					Code
				</a>

				<OAuth />
			</div>
		</>
	);
}
