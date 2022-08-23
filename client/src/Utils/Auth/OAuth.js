import React from 'react';
import { Button } from 'Components/Elements/Button/Button';
import { Icon } from 'Components/Elements/Icon';
import { ApiRoutes } from 'Utils/Router/ApiRoutes';

export function OAuth() {
	function connectToDropbox() {
		fetch(ApiRoutes.authUrl)
			.then((res) => res.json())
			.then((data) => window.location.replace(data.authUrl));
	}

	return <Button icon={Icon.link} caption="Connect my Dropbox Team" handleOnClick={connectToDropbox} color="blue" />;
}
