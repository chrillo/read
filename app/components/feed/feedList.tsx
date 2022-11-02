import { FeedItem } from '@prisma/client';
import { useState } from 'react';
import { FeedItemGroup } from '~/routes';

import { formatDate, formatDayOfWeek } from '~/utils/format';
import { FeedListItem } from './feedListItem';

const GroupHeader = ({
	date,
	unreadCount,
	markDateAsRead,
	onToggleOpen,
}: {
	date: Date;
	unreadCount: number;
	markDateAsRead: () => Promise<FeedItem[]>;
	onToggleOpen: () => void;
}) => {
	const displayDate =
		formatDayOfWeek(date.getDay()) + ' ' + formatDate(date, 'dd.MM.yyyy');

	return (
		<div className="feed-group-header" onClick={onToggleOpen}>
			<span>
				{displayDate} <span className="feed-group-unread-count">{unreadCount}</span>
			</span>
			<button
				onClick={(event) => {
					event.stopPropagation();
					markDateAsRead();
				}}
				className="button"
			>
				Read
			</button>
		</div>
	);
};

export const FeedList = ({
	group,
	domain,
	markItemsAsRead,
}: {
	group: FeedItemGroup;
	domain: string;
	markItemsAsRead: (items: FeedItem[]) => Promise<FeedItem[]>;
}) => {
	const { items, date, unreadCount } = group;
	const [open, setOpen] = useState(false);

	return (
		<div className={`feed-item-list ${open ? 'open' : ''}`}>
			<GroupHeader
				onToggleOpen={() => setOpen(!open)}
				date={date}
				unreadCount={unreadCount}
				markDateAsRead={() => markItemsAsRead(items)}
			/>
			{open ? (
				<div className="feed-items">
					{items.map((item) => {
						return (
							<FeedListItem
								domain={domain}
								markItemsAsRead={markItemsAsRead}
								item={item}
								key={item.id}
							/>
						);
					})}
				</div>
			) : null}
			{open && unreadCount > 0 ? (
				<GroupHeader
					onToggleOpen={() => setOpen(!open)}
					date={date}
					unreadCount={unreadCount}
					markDateAsRead={() => markItemsAsRead(items)}
				/>
			) : null}
		</div>
	);
};
