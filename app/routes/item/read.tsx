import { ActionFunction, json } from 'remix';
import { updateFeedItems } from '~/server/feed/feed.server';

export const action: ActionFunction = async ({ request, params }) => {
	const ids = (await request.json()) as string[];
	if (!ids) return null;
	return json(await updateFeedItems(ids, { read: true }));
};
