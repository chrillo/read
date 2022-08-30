import { ActionFunction, json, LoaderFunction, redirect } from '@remix-run/node';
import { useActionData, useLoaderData } from '@remix-run/react';
import { Page } from '~/components/app/page';
import { getFeedDelivery, updateFeedDelivery } from '~/server/feed/feed.server';
import { FeedDeliveryForm, validateFeedDeliveryInput } from './new';

export const action: ActionFunction = async ({ request, params }) => {
	const { deliveryId } = params;
	if (!deliveryId) return json({ errors: { id: 'id is required' } });
	const formData = await request.formData();
	const { values, errors } = await validateFeedDeliveryInput(formData);

	if (Object.keys(errors).length) {
		return json({ errors, values });
	}

	await updateFeedDelivery(deliveryId, values);

	return redirect(`/delivery`);
};

export const loader: LoaderFunction = ({ request, params }) => {
	const { deliveryId } = params;
	if (!deliveryId) return null;
	return getFeedDelivery(deliveryId);
};

export const NewFeedSource = () => {
	const feed = useLoaderData();
	const actionData = useActionData();

	return (
		<Page>
			<FeedDeliveryForm errors={actionData?.errors} defaultValues={feed} />
		</Page>
	);
};
export default NewFeedSource;
