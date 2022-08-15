import { React } from 'react';
import Nav from '../Nav/Nav';
import ToolsBar from '../ToolsBar/ToolsBar';
import styles from './layout.module.css';

export default function Layout(props) {
	return (
		<>
			<div className={styles.navContainer}>
				<Nav />
			</div>

			{/* <div className={styles.toolsBarContainer}>
				<ToolsBar />
			</div> */}

			<div className={styles.contentContainer}>{props.children}</div>
		</>
	);
}
