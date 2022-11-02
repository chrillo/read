import type { FeedItem } from '@prisma/client';
import { useCallback, useState } from 'react';
import { formatDate } from '~/utils/format';
import { relativeTime } from '~/utils/relativeTime';

const getDomain = (link?: string) => {
	if (!link) return null;
	return new URL(link).hostname.replace('www.', '');
};

const proxyDomain = (url: string, domain: string) => {
	return url.replace('https://news.ycombinator.com', `${domain}/proxy/hackernews/`);
};

export const FeedListItem = ({
	item,
	domain,
	markItemsAsRead,
}: {
	item: FeedItem;
	domain: string;
	markItemsAsRead: (items: FeedItem[]) => Promise<FeedItem[]>;
}) => {
	const [submission, setSubmission] = useState(false);

	const onMarkAsRead = useCallback(async () => {
		setSubmission(true);
		await markItemsAsRead([item]);
		setSubmission(false);
	}, [item, markItemsAsRead]);

	if (item.read) return null;

	return (
		<div className="feed-item" key={item.id}>
			<div className="feed-item-content">
				<a
					className="title"
					target="_blank"
					href={proxyDomain(item.url, domain)}
					rel="noreferrer"
				>
					{item.title}
				</a>
				<div className="feed-item-meta">
					<span className="source">{getDomain(item.url)}</span>
					<span className="time" title={formatDate(item.createdAt, 'dd.MM.yyyy HH:ii')}>
						{relativeTime(item.createdAt)}
					</span>
					{item.commentsUrl ? (
						<a
							className="comments"
							target="_blank"
							href={proxyDomain(item.commentsUrl, domain)}
							rel="noreferrer"
						>
							Comments
						</a>
					) : null}
				</div>
			</div>
			{/* <div className="feed-item-actions">
				<button disabled={submission} className="button" onClick={onMarkAsRead}>
					Read
				</button>
			</div> */}
		</div>
	);
};
