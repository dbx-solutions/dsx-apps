import { useEffect, useState } from 'react';
import Layout from 'components/Layout/Layout';
import ApiRoutes from 'utils/ApiRoutes';
import Button from 'components/Elements/Button/Button';
import Icon from 'components/Elements/Icon';
import styles from './folder_structure.module.css';

export default function FolderStructure() {
	const [templates, setTemplates] = useState([]);
	const [template, setTemplate] = useState('');
	const [folderName, setFolderName] = useState('');

	useEffect(() => {
		prepareTemplateList();
	}, []);

	function prepareTemplateList() {
		fetch(ApiRoutes.templateList)
			.then((res) => res.json())
			.then((data) => {
				const templateList = data.templateList;
				setTemplates(templateList);
				setTemplate(templateList[0].value);
			});
	}

	function createFromTemplate() {
		fetch(
			ApiRoutes.folderStructure +
				'?' +
				new URLSearchParams({
					rootName: folderName,
					templateName: template,
				})
		).then(() => window.location.replace('/'));
	}

	return (
		<Layout>
			<div className={styles.leftSide}>
				<div className={styles.art}>
					<div className={styles.artItem}>{Icon.folder}</div>
					<div className={styles.artItem}>{Icon.relax}</div>
				</div>
				<span className={styles.artTagline}>All your folder structures automatically created in seconds</span>
			</div>

			<div className={styles.verticalDivider}></div>

			<div className={styles.rightSide}>
				<span className={styles.formTagline}>Create a project folder structure</span>

				<div className={styles.form}>
					<div className={styles.control}>
						<span className={styles.formLabel}>Choose a template</span>

						<div className={styles.select}>
							<select onChange={(e) => setTemplate(e.target.value)}>
								{templates.map((template, index) => {
									return (
										<option value={template.value} key={index}>
											{template.label}
										</option>
									);
								})}
							</select>
						</div>
					</div>

					<div className={styles.control}>
						<span className={styles.formLabel}>Enter project name</span>

						<input
							className={styles.input}
							placeholder="Project name"
							value={folderName}
							onChange={(e) => setFolderName(e.target.value)}
						/>
					</div>

					<div className={styles.buttonContainer}>
						<Button icon={Icon.plus} caption="Create project" handleOnClick={createFromTemplate} />
					</div>
				</div>
			</div>
		</Layout>
	);
}
