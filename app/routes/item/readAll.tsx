import { json, LoaderFunction } from '@remix-run/node';
import { markAllRead } from '~/server/feed/feed.server';

export const loader: LoaderFunction = async () => {
	return json(await markAllRead());
};
