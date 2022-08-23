import { useEffect, useState } from 'react';
import { Layout } from 'Pages/Layout/Layout';
import { Button } from 'Components/Elements/Button/Button';
import { Icon } from 'Components/Elements/Icon';
import { ApiRoutes } from 'Utils/Router/ApiRoutes';
import styles from './folder_structure.module.css';

export function FolderStructure() {
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
		<Layout title="Folder Templates">
			<div className={styles.container}>
				<h2 className={styles.tagline}>All your folder structures automatically created in seconds</h2>

				<div className={styles.form}>
					<span className={styles.formTagline}>Create a project folder structure</span>
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

					<Button icon={Icon.plus} caption="Create project from template" handleOnClick={createFromTemplate} />
				</div>
			</div>
		</Layout>
	);
}
