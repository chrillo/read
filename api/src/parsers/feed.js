const USER_AGENT =
	'Read RSS https://github.com/chrillo/read';
const AcceptHeader = 'text/html,application/xhtml+xml,application/xml';


function sleep(time) {
	if (time <= 0) {
		return Promise.resolve();
	}
	return new Promise(resolve => setTimeout(resolve, time));
}

function checkHeaders(stream, url, checkContenType = false) {
	return new Promise((resolve, reject) => {
		let resolved = false;
		let bodyLength = 0;

		//XXX: piping to a pass through dummy stream so we can pipe it later
		//     without causing request errors
		let dummy = new PassThrough();
		stream.pipe(dummy);

		stream
			.on('response', response => {
				if (checkContenType) {
					const contentType = response.headers['content-type'];
					if (
						!contentType ||
						!contentType
							.trim()
							.toLowerCase()
							.includes('html')
					) {
						logger.warn(
							`Invalid content type '${contentType}' for url ${url}`,
						);
						stream.abort();
						return resolve(null);
					}
				}
				const contentLength = parseInt(response.headers['content-length'], 10);
				if (contentLength > maxContentLengthBytes) {
					stream.abort();
					return reject(
						new Error('Request body larger than maxBodyLength limit'),
					);
				}
				const encoding = response.headers['content-encoding'] || 'identity';
				let inflater;
				switch (encoding.trim().toLowerCase()) {
					case 'deflate':
						inflater = new InflateAuto();
						break;
					case 'gzip':
						inflater = new Gunzip();
						break;
				}
				if (inflater) {
					dummy = dummy.pipe(inflater);
				}
				dummy.on('error', err => {
					if (!resolved) {
						reject(err);
					}
					stream.abort();
				});
			})
			.on('error', err => {
				if (!resolved) {
					reject(err);
				} else {
					dummy.destroy(err);
				}
				stream.abort();
			})
			.on('data', data => {
				resolved = true;
				resolve(dummy);

				if (bodyLength + data.length <= maxContentLengthBytes) {
					bodyLength += data.length;
				} else {
					dummy.destroy(
						new Error('Request body larger than maxBodyLength limit'),
					);
				}
			})
			.on('end', () => {
				if (!resolved) {
					resolve(dummy);
				}
			});
	});
}

export async function ReadPageURL(url, retries = 2, backoffDelay = 100) {
	let currentDelay = 0,
		nextDelay = backoffDelay;
	for (;;) {
		try {
			await sleep(currentDelay);
			return await checkHeaders(ReadURL(url), url, true);
		} catch (err) {
			logger.warn(`Failed to read page url ${url}: ${err.message}. Retrying`);
			--retries;
			[currentDelay, nextDelay] = [nextDelay, currentDelay + nextDelay];
			if (!retries) {
				throw err;
			}
		}
	}
}
export function ReadURL(url) {
	let headers = {
		'User-Agent': USER_AGENT,
		'Accept-Encoding': 'gzip,deflate',
		Accept: AcceptHeader,
	};
	return request({
		method: 'get',
		agent: false,
		pool: { maxSockets: 256 },
		uri: url,
		timeout: requestTTL,
		headers: headers,
		maxRedirects: 20,
		resolveWithFullResponse: true,
	});
}