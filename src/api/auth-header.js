/* The authentication function that is called 
whenever a user makes an API request. 
Checks if the token is till valid in local storage*/

export default function authHeader() {
	const user = JSON.parse(localStorage.getItem('user'));
	let tokenAlive;
	if (user) {
		tokenAlive = Date.now() <= user.expiresAt;
	}

	if (user && tokenAlive) {
		return { 'x-access-token': user.accessToken };
	} else {
		return {};
	}
}
