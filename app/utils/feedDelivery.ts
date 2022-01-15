import { FeedDelivery } from '@prisma/client';
import { addDays } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

export const getNextDelivery = (delivery: FeedDelivery, now: Date = new Date()): Date => {
	const { hour, timeZone, lastDeliveredAt, activeDays } = delivery;

	const date = lastDeliveredAt ? new Date(lastDeliveredAt) : new Date();

	date.setHours(hour);
	date.setSeconds(0);
	date.setMilliseconds(0);
	date.setMinutes(0);
	let nextDelivery = zonedTimeToUtc(date, timeZone);

	if (nextDelivery < now) {
		nextDelivery = addDays(nextDelivery, 1);
	}
	let day = nextDelivery.getDay();
	if (activeDays.length) {
		while (!activeDays.includes(day)) {
			nextDelivery = addDays(nextDelivery, 1);
			day = nextDelivery.getDay();
		}
	}
	return nextDelivery;
};
