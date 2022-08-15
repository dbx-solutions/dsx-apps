import { React } from 'react';
import Icon from '../Elements/Icon';
import Button from '../Elements/Button/Button';
import styles from './tools_bar.module.css';

export default function ToolsBar() {
	function handleCreateProject() {
		window.location.href = '/folder-structure/create';
	}

	function handleCreateTemplate() {
		window.location.href = '/template/create';
	}

	function handleViewTemplates() {
		window.location.href = '/template/view';
	}

	return (
		<>
			<div className={styles.leftSide}>
				<span className={styles.tagline}>Virtual Lockers</span>
			</div>

			<div className={styles.rightSide}>
				{/* <Button
					icon={Icon.plus}
					caption="Create project from template"
					color="blue"
					handleOnClick={handleCreateProject}
				/>
				<Button icon={Icon.plus} caption="Create template" color="gray" handleOnClick={handleCreateTemplate} />
				<Button icon={Icon.template} caption="View templates" color="gray" handleOnClick={handleViewTemplates} /> */}
			</div>
		</>
	);
}
