import React from 'react';
import ApiRoutes from 'utils/Router/ApiRoutes';
import Button from 'components/Elements/Button/Button';
import Icon from 'components/Elements/Icon';

export default function OAuth() {
	function connectToDropbox() {
		fetch(ApiRoutes.authUrl)
			.then((res) => res.json())
			.then((data) => window.location.replace(data.authUrl));
	}

	return <Button icon={Icon.link} caption="Sign in with Dropbox" handleOnClick={connectToDropbox} color="gray" />;
}
