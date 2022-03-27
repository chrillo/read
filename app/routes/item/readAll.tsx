import { json, LoaderFunction } from 'remix';
import { markAllRead } from '~/server/feed/feed.server';

export const loader: LoaderFunction = async () => {
	return json(await markAllRead());
};
