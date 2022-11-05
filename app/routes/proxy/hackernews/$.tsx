import type { LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = async ({ request, params }) => {
	const path = params['*'];
	const url = new URL(request.url);
	if (!path) {
		throw new Error('item id required');
	}
	if (path === 'news') {
		return new Response('blocked', { status: 403 });
	}
	const proxyUrl = `https://news.ycombinator.com/${path}${url.search}`;
	return fetch(proxyUrl);

	//return new Response(itemId, {
	// 	headers: {
	// 		'Cache-Control': `public, max-age=${60 * 10}, s-maxage=${60 * 60 * 24}`,
	// 		'Content-Type': 'application/xml',
	// 		'Content-Length': String(Buffer.byteLength(itemId)),
	// 	},
	// });
};
