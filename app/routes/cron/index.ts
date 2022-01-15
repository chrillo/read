import { json } from 'remix';
import { deliverItems, syncFeeds } from '~/server/feed/feed.server';

export async function loader() {
	console.log('sync feeds');
	const feeds = await syncFeeds();
	console.log('deliver items');
	const deliveries = await deliverItems();
	return json({ feeds, deliveries });
}
