export const authService = {
    login,
		logout,
		getAuthHeader
};

function login(username, email, dob, ...rest) {
	const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username, email, dob, ...rest })
	};

	return fetch(`https://pally.build1.apyhi.com/api/auth/social-login`, requestOptions)
		.then(handleResponse)
		.then(user => {
			// store user details and jwt token in local storage to keep user logged in between page refreshes
			localStorage.setItem('user', JSON.stringify(user));
			console.log(localStorage.getItem('user'))
			return user;
		});
}

function logout() {
	// remove user from local storage to log user out
	localStorage.removeItem('user');
}

function handleResponse(response) {
	return response.text().then(text => {
		const data = text && JSON.parse(text);
		if (!response.ok) {
			if (response.status === 401) {
					// auto logout if 401 response returned from api
					logout();
			}

			const error = (data && data.message) || response.statusText;
			return Promise.reject(error);
		}

		return data;
	});
}

function getAuthHeader() {
	// return authorization header with jwt token
	let user = JSON.parse(localStorage.getItem('user'));
	console.log(user.token)
	if (user && user.token) {
			return { 'Authorization': 'Bearer ' + user.token };
	} else {
			return {};
	}
}
