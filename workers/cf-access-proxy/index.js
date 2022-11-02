addEventListener('fetch', (event) => {
	event.respondWith(
		handleRequest(event.request).catch((err) => new Response(err.stack, { status: 500 })),
	);
});

const AUTH_URL = 'https://oauth2.googleapis.com/token';

async function handleRequest(request) {
	const url = new URL(request.url);
	console.log('proxy request', request);
	let token = await CACHE.get('idToken', { cacheTtl: 3500 });
	console.log('got token', token);
	if (!token || token === 'undefined') {
		const json = JSON.parse(SERVICE_ACCOUNT_JSON);
		console.log('fetch new token', json);
		const auth = await getGoogleAuthToken(
			json.client_email,
			json.private_key,
			json.private_key_id,
			SERVICE_URL,
		);
		console.log('got auth', auth);
		token = auth.id_token;
		await CACHE.put('idToken', token, { expirationTtl: 3500 });
		console.log('put token');
	}
	console.log('forward request', url);
	const requestWithToken = new Request(request);

	requestWithToken.headers.append('Authorization', `Bearer ${token}`);

	return fetch(requestWithToken);
}

async function getGoogleAuthToken(user, key, keyId, scope) {
	function objectToBase64url(object) {
		return arrayBufferToBase64Url(new TextEncoder().encode(JSON.stringify(object)));
	}
	function arrayBufferToBase64Url(buffer) {
		return btoa(String.fromCharCode(...new Uint8Array(buffer)))
			.replace(/=/g, '')
			.replace(/\+/g, '-')
			.replace(/\//g, '_');
	}
	function str2ab(str) {
		const buf = new ArrayBuffer(str.length);
		const bufView = new Uint8Array(buf);
		for (let i = 0, strLen = str.length; i < strLen; i++) {
			bufView[i] = str.charCodeAt(i);
		}
		return buf;
	}
	async function sign(content, signingKey) {
		const buf = str2ab(content);
		const plainKey = signingKey
			.replace('-----BEGIN PRIVATE KEY-----', '')
			.replace('-----END PRIVATE KEY-----', '')
			.replace(/(\r\n|\n|\r)/gm, '');
		const binaryKey = str2ab(atob(plainKey));
		const signer = await crypto.subtle.importKey(
			'pkcs8',
			binaryKey,
			{
				name: 'RSASSA-PKCS1-V1_5',
				hash: { name: 'SHA-256' },
			},
			false,
			['sign'],
		);
		const binarySignature = await crypto.subtle.sign(
			{ name: 'RSASSA-PKCS1-V1_5' },
			signer,
			buf,
		);
		return arrayBufferToBase64Url(binarySignature);
	}

	const jwtHeader = objectToBase64url({ alg: 'RS256', typ: 'JWT', KeyID: keyId });
	try {
		const assertiontime = Math.round(Date.now() / 1000);
		const expirytime = assertiontime + 3600;
		const claimset = objectToBase64url({
			iss: user,
			scope: scope,
			aud: AUTH_URL,
			exp: expirytime,
			iat: assertiontime,
		});

		const jwtUnsigned = jwtHeader + '.' + claimset;
		const signedJwt = jwtUnsigned + '.' + (await sign(jwtUnsigned, key));
		const body =
			'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=' +
			signedJwt;
		const response = await fetch(AUTH_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Cache-Control': 'no-cache',
			},
			body: body,
		});
		const oauth = await response.json();
		return oauth;
	} catch (err) {
		console.log(err);
	}
}
