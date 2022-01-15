import { isBoolean, isString } from './typeGuards';

export const getValues = (formData: FormData) => {
	const values = Object.fromEntries(formData);
	console.log('form ');
	return Object.keys(values).reduce((agg, key) => {
		if (isString(values[key])) agg[key] = values[key].toString();
		return agg;
	}, {} as { [key: string]: string });
};

export const getString = (formData: FormData, key: string) => {
	const value = formData.get(key);
	return value ? value.toString() : '';
};
export const getInt = (formData: FormData, key: string) => {
	const value = getString(formData, key);
	return value !== undefined ? parseInt(value, 10) : 0;
};
export const getCheckbox = (formData: FormData, key: string) => {
	return getString(formData, key) === 'on' ? true : false;
};
export const getStringArray = (formData: FormData, key: string) => {
	return formData.getAll(key).map((value) => value.toString());
};
