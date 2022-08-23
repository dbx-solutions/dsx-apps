import React from 'react';
import styles from './button.module.css';

export default function Button(props) {
	const color = props.color == 'gray' ? styles.gray : styles.blue;

	return (
		<button
			className={`${styles.button} ${color}`}
			onClick={props.handleOnClick}
		>
			<span className={styles.icon}>{props.icon}</span>
			<span>
				<strong>{props.caption}</strong>
			</span>
		</button>
	);
}
