import { FeedItem } from '@prisma/client';
import { FeedListItem } from './feedListItem';

export const FeedList = ({
	items,
	markAsRead,
}: {
	items: FeedItem[];
	markAsRead: (item: FeedItem) => Promise<FeedItem>;
}) => {
	const onNext = async () => {
		const nextItem = items.find((item) => !item.read);
		if (nextItem) {
			await markAsRead(nextItem);
		}
	};

	return (
		<div className="feed-item-list">
			<div className="feed-actions">
				<span className="feed-item-next">
					<button onClick={onNext} className="button">
						next
					</button>
				</span>
			</div>
			<div className="feed-items">
				{items.map((item) => {
					return <FeedListItem markAsRead={markAsRead} item={item} key={item.id} />;
				})}
			</div>
		</div>
	);
};
