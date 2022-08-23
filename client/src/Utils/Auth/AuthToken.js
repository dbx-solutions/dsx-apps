import { useSearchParams } from 'react-router-dom';
import ApiRoutes from 'utils/Router/ApiRoutes';

export default function AuthToken() {
	const [searchParams, setSearchParams] = useSearchParams();
	const code = searchParams.get('code');

	fetch(ApiRoutes.authToken + '?code=' + code).then(() => window.location.replace('/'));
}
