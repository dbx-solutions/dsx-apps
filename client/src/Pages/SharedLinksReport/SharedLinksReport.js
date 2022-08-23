import { useEffect, useState } from 'react';
import { Layout } from 'Pages/Layout/Layout';
import styles from './SharedLinksReport.module.css';

export function SharedLinksReport() {
	return (
		<Layout title="Shared Links Report">
			<h2 className={styles.tagline}>Extra security for your team's external sharing</h2>
		</Layout>
	);
}
