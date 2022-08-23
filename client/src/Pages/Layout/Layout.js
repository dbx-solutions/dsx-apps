import { React } from 'react';
import { Nav } from 'Components/Nav/Nav';
import { ToolsBar } from 'Components/ToolsBar/ToolsBar';
import styles from './layout.module.css';

export function Layout(props) {
	return (
		<>
			<div className={styles.navContainer}>
				<Nav />
			</div>

			<div className={styles.toolsBarContainer}>
				<ToolsBar title={props.title} />
			</div>

			<div className={styles.contentContainer}>{props.children}</div>
		</>
	);
}
