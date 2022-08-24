import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Main } from 'Pages/Main/Main';
import { FolderStructure } from 'Pages/FolderStructure/FolderStructure';
import { SharedLinksReport } from 'Pages/SharedLinksReport/SharedLinksReport';
import { SharedLinksReportForMember } from 'Pages/SharedLinksReport/SharedLinksReportForMember';
import { AuthToken } from 'Utils/Auth/AuthToken';

export function Router() {
	return (
		<Routes>
			<Route path="/" element={<Main />} />
			<Route path="/auth/token" element={<AuthToken />} />
			<Route path="/folder-templates" element={<FolderStructure />} />
			<Route path="/shared-links-report" element={<SharedLinksReport />} />
			<Route path="/shared-links-report/:team_member_id" element={<SharedLinksReportForMember />} />
		</Routes>
	);
}
