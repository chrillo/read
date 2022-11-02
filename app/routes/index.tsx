import { LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { FeedList } from '~/components/feed/feedList';
import { getFeedItems } from '~/server/feed/feed.server';
import { FeedListEmpty } from '~/components/feed/feedListEmpty';
import { Page } from '~/components/app/page';
import { FeedItem } from '@prisma/client';
import { useCallback, useMemo, useState } from 'react';
import { formatDate } from '~/utils/format';

type LoaderData = {
	items: FeedItem[];
	domain: string;
};

export type FeedItemGroup = {
	items: FeedItem[];
	unreadCount: number;
	date: Date;
};

export const loader: LoaderFunction = async ({
	request,
	params,
}): Promise<LoaderData> => {
	const host = request.headers.get('X-Forwarded-Host') ?? request.headers.get('host');
	if (!host) {
		throw new Error('Could not determine domain URL.');
	}
	const protocol = host.includes('localhost') ? 'http' : 'https';
	const domain = `${protocol}://${host}`;
	const { items } = await getFeedItems();
	console.log('domain', domain);
	return { items, domain };
};

const itemsToGroups = (
	items: FeedItem[],
	ids: string[] = [],
	data: Partial<FeedItem> = {},
) => {
	let unreadCount = 0;
	const grouped = items.reduce((agg, item) => {
		const date = formatDate(item.createdAt, 'yyyyMMdd');
		agg[date] = agg[date] || {
			items: [],
			unreadCount: 0,
			date: new Date(item.createdAt),
		};
		agg[date].items.push(item);
		if (!item.read) {
			unreadCount++;
			agg[date].unreadCount++;
		}
		return agg;
	}, {} as Record<string, FeedItemGroup>);

	const groups = Object.keys(grouped)
		.sort()
		.reverse()
		.reduce((agg, key) => {
			agg.push(grouped[key]);
			return agg;
		}, [] as FeedItemGroup[]);
	return { groups, unreadCount };
};

const useFeedItems = () => {
	const { items: allItems, domain } = useLoaderData<LoaderData>();
	const [items, setItems] = useState<FeedItem[]>(allItems);

	const { groups, unreadCount } = useMemo(() => {
		return itemsToGroups(items);
	}, [items]);

	const updateItems = useCallback(
		(ids: string[], data: Partial<FeedItem>) => {
			setItems(
				items.map((item) => {
					if (ids.includes(item.id)) {
						item = { ...item, ...data };
					}
					return item;
				}),
			);
		},
		[items],
	);

	// not doing this the remix way to avoid refetching the entire page when one item is marked as read
	const markItemsAsRead = useCallback(
		async (items: FeedItem[]) => {
			const ids = items.map((item) => item.id);
			try {
				updateItems(ids, { read: true });
				const res = await fetch(`/item/read`, {
					method: 'post',
					body: JSON.stringify(ids),
				});
				return await res.json();
			} catch (e) {
				console.error(e);
				updateItems(ids, { read: false });
			}
			return items;
		},
		[updateItems],
	);

	return { items, groups, unreadCount, markItemsAsRead, domain };
};

export default function Index() {
	const { groups, unreadCount, markItemsAsRead, domain } = useFeedItems();

	return (
		<Page>
			{unreadCount > 0 && groups.length > 0 ? (
				groups.map((group) => (
					<FeedList
						domain={domain}
						key={group.date.toDateString()}
						group={group}
						markItemsAsRead={markItemsAsRead}
					></FeedList>
				))
			) : (
				<FeedListEmpty />
			)}
			<div className="feed-item-count">{unreadCount}</div>
		</Page>
	);
}
