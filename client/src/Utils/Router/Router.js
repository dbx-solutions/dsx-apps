import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Main from 'pages/Main/Main';
import FolderStructure from 'pages/FolderStructure/FolderStructure';
import AuthToken from 'utils/Auth/AuthToken';

export default function Router() {
	return (
		<Routes>
			<Route path="/" element={<Main />} />
			<Route path="/auth/token" element={<AuthToken />} />
			<Route path="/folder-structure" element={<FolderStructure />} />
		</Routes>
	);
}
