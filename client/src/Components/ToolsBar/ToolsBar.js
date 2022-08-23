import { React } from 'react';
import { Button } from 'Components/Elements/Button/Button';
import { Icon } from 'Components/Elements/Icon';
import styles from './tools_bar.module.css';

export function ToolsBar(props) {
	return (
		<>
			<div className={styles.leftSide}>
				<span className={styles.tagline}>{props.title}</span>
			</div>

			{/* <div className={styles.rightSide}>
				<Button icon={Icon.plus} caption="Do something" color="blue" handleOnClick={null} />
				<Button icon={Icon.plus} caption="Do something else" color="gray" handleOnClick={null} />
				<Button icon={Icon.plus} caption="Do more" color="gray" handleOnClick={null} />
			</div> */}
		</>
	);
}
