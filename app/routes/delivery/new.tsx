import { FeedDelivery } from '@prisma/client';
import { ActionFunction, Form, json, Link, redirect, useActionData } from 'remix';
import { Page } from '~/components/app/page';
import { FormActions } from '~/components/form/formActions';
import { FormSubmit } from '~/components/form/formButton';
import { FormCheckbox } from '~/components/form/formCheckbox';
import { FormInput } from '~/components/form/formInput';
import { createFeedDelivery } from '~/server/feed/feed.server';
import { formatDayOfWeek } from '~/utils/format';
import { getCheckbox, getInt, getString, getStringArray } from '~/utils/validation';

export const validateFeedDeliveryInput = async (formData: FormData) => {
	console.log(formData);
	const active = getCheckbox(formData, 'active');
	const hour = getInt(formData, 'hour');
	const activeDays = getStringArray(formData, 'activeDays');
	const timeZone = getString(formData, 'timeZone');

	const errors = {} as Record<string, string>;
	if (hour < 0 || hour > 23) errors.hour = 'Enter a value between 0 - 23';

	return {
		errors,
		values: {
			hour,
			active,
			activeDays: activeDays.map(Number),
			timeZone,
		},
	};
};
// console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)
// https://github.com/dailydotdev/apps/blob/master/packages/shared/src/lib/timezones.ts
export const FeedDeliveryForm = ({
	errors,
	defaultValues,
}: {
	errors?: { [key: string]: string };
	defaultValues?: Partial<FeedDelivery>;
}) => {
	return (
		<Form method="post">
			<p>
				<FormInput
					name="hour"
					label="Hour:"
					defaultValue={defaultValues?.hour}
					error={errors?.hour}
				/>
			</p>
			<p>
				<FormInput
					name="timeZone"
					label="Timezone:"
					defaultValue={defaultValues?.timeZone}
					error={errors?.timeZone}
				/>
			</p>

			{[1, 2, 3, 4, 5, 6, 0].map((day) => {
				return (
					<p key={day}>
						<FormCheckbox
							value={day + ''}
							name="activeDays"
							label={formatDayOfWeek(day)}
							defaultValue={defaultValues?.activeDays?.includes(day)}
						/>
					</p>
				);
			})}

			<p>
				<FormCheckbox
					name="active"
					label="Active:"
					defaultValue={defaultValues?.active}
				/>
			</p>
			<FormActions>
				<FormSubmit label="Save" />
				<Link to="/delivery">Cancel</Link>
			</FormActions>
		</Form>
	);
};

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData();
	const { values, errors } = await validateFeedDeliveryInput(formData);

	console.log('create action', values, errors);
	if (Object.keys(errors).length) {
		return json({ errors, values });
	}

	await createFeedDelivery(values);

	return redirect(`/delivery`);
};

export const loader = () => {
	return null;
};

export const NewFeedSource = () => {
	const actionData = useActionData();
	console.log('action data', actionData);
	return (
		<Page>
			<FeedDeliveryForm errors={actionData?.errors} defaultValues={actionData?.values} />
		</Page>
	);
};
export default NewFeedSource;
