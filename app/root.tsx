import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from 'remix';
import type { MetaFunction } from 'remix';
import styles from '~/styles/global.css';

export function links() {
	return [{ rel: 'stylesheet', href: styles }];
}

export const meta: MetaFunction = () => {
	return { title: 'Read' };
};

export const loader = () => {
	return {
		ENV: {
			env: 'dev',
		},
	};
};

export default function App() {
	const data = useLoaderData();
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				<script
					dangerouslySetInnerHTML={{ __html: `var ENV = ${JSON.stringify(data.ENV)}` }}
				></script>
				{process.env.NODE_ENV === 'development' && <LiveReload />}
			</body>
		</html>
	);
}
