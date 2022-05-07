import { format } from 'date-fns';

export const formatDayOfWeek = (day: number) => {
	const date = new Date();
	const currentDay = date.getDay();
	const distance = day - currentDay;
	date.setDate(date.getDate() + distance);
	return date.toLocaleString('en', { weekday: 'long' });
};

export const formatDate = (date: string | Date, dateFormat: string) => {
	return format(new Date(date), dateFormat);
};
