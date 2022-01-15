import { FeedDelivery } from '@prisma/client';
import { format } from 'date-fns';
import { Link, useLoaderData } from 'remix';
import { Page, PageActions } from '~/components/app/page';
import { getFeedDeliveries } from '~/server/feed/feed.server';
import { getNextDelivery } from '~/utils/feedDelivery';
import { formatDayOfWeek } from '~/utils/format';
import { relativeTime } from '~/utils/relativeTime';

export const loader = async () => {
	return await getFeedDeliveries();
};

export default function FeedsList() {
	const data = useLoaderData<FeedDelivery[]>();
	return (
		<Page>
			<PageActions>
				<Link className="button" to="new">
					New Feed Delivery
				</Link>
			</PageActions>
			{data.map((delivery) => {
				return (
					<div key={delivery.id} className="feed-delivery">
						<div className="feed-delivery-content">
							<Link to={`${delivery.id}`}>
								{delivery.active ? '' : 'disabled: '} {delivery.hour}:00 on{' '}
								{delivery.activeDays.map(formatDayOfWeek).join(', ')}
							</Link>
						</div>
						<div className="feed-delivery-meta">
							<span>
								Last:{' '}
								{delivery.lastDeliveredAt
									? relativeTime(delivery.lastDeliveredAt)
									: ' - '}
							</span>
							{delivery.active ? (
								<span>Next: {format(getNextDelivery(delivery), 'HH:mm dd.MM.yyyy')}</span>
							) : (
								'disabled'
							)}
						</div>
					</div>
				);
			})}
		</Page>
	);
}
