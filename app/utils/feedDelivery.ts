import { FeedDelivery } from '@prisma/client';
import { addDays } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

export const getNextDelivery = (
	delivery: FeedDelivery,
	nowValue: Date = new Date(),
): Date => {
	const { hour, timeZone, lastDeliveredAt, activeDays } = delivery;

	const currentHour = new Date(nowValue);
	currentHour.setMinutes(0);
	currentHour.setSeconds(0);
	currentHour.setMilliseconds(0);

	const date = lastDeliveredAt ? new Date(lastDeliveredAt) : new Date();
	date.setHours(hour);
	date.setSeconds(0);
	date.setMilliseconds(0);
	date.setMinutes(0);

	const lastDeliveredAtUtc = zonedTimeToUtc(date, timeZone);
	let nextDelivery = lastDeliveredAtUtc;
	if (lastDeliveredAtUtc.getTime() === currentHour.getTime()) {
		nextDelivery = addDays(nextDelivery, 1);
	}
	let day = nextDelivery.getDay();

	if (activeDays.length) {
		while (!activeDays.includes(day) || nextDelivery < currentHour) {
			//console.log(nextDelivery, currentHour);
			nextDelivery = addDays(nextDelivery, 1);
			day = nextDelivery.getDay();
			//console.log('active days', activeDays, day);
		}
	}
	return nextDelivery;
};
