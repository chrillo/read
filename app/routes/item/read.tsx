import { ActionFunction, json } from 'remix';
import { updateFeedItem } from '~/server/feed/feed.server';
import { promiseMap } from '~/utils/promiseMap';

export const action: ActionFunction = async ({ request, params }) => {
	const ids = (await request.json()) as string[];
	if (!ids) return null;
	return json(
		await promiseMap(
			ids,
			async (id) => {
				return await updateFeedItem(id, { read: true });
			},
			{ concurrency: 5 },
		),
	);
};
