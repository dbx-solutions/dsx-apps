import { React } from 'react';
import OAuth from '../Auth/OAuth';
import Icon from '../Elements/Icon';
import styles from './nav.module.css';

export default function Nav() {
	return (
		<>
			<div className={styles.leftSide}>
				{/* <span className={styles.logo}> {Icon.logo}</span> */}

				<span className={styles.projectName}>KIND Virtual Lockers</span>
				<span className={styles.beta}>Beta</span>
			</div>

			<div className={styles.rightSide}>
				<OAuth />
			</div>
		</>
	);
}
