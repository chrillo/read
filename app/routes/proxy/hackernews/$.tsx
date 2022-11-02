import type { LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = async ({ request, params }) => {
	const path = params['*'];
	console.log(request, params);
	const url = new URL(request.url);
	if (!path) {
		throw new Error('item id required');
	}

	const proxyUrl = `https://news.ycombinator.com/${path}${url.search}`;
	console.log(proxyUrl);
	return fetch(proxyUrl);

	//return new Response(itemId, {
	// 	headers: {
	// 		'Cache-Control': `public, max-age=${60 * 10}, s-maxage=${60 * 60 * 24}`,
	// 		'Content-Type': 'application/xml',
	// 		'Content-Length': String(Buffer.byteLength(itemId)),
	// 	},
	// });
};
