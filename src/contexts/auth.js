import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import insertData from '../api/insertData';

const AuthContext = createContext({});
const useAuth = () => useContext(AuthContext);

function AuthProvider(props) {
	const storedUser = localStorage.getItem('user');
	var tokenTime;
	if (storedUser) {
		tokenTime = JSON.parse(storedUser).expiresAt;
	}

	//Checks that the token is still valid and set the user object
	const [ user, setUser ] = useState(Date.now() <= tokenTime ? JSON.parse(storedUser) : undefined);
	const [ loading, setLoading ] = useState(true);

	const logIn = useCallback(async (email, password) => {
		// Send login request
		const userType = 'carer';

		const response = await insertData('/api/auth/signin', { email, password, userType });
		const data = await response.json();

		//console.log(data)
		if (!data.photo) {
			data.photo = `/images/carers/1.png`;
		}
		if (data.accessToken) {
			setUser({
				...data,
			});
		}

		return data;
	}, []);

	const logOut = useCallback(() => {
		// Clear user data

		setUser();
	}, []);

	useEffect(
		() => {
			// Store user data in localstorage

			if (user) {
				localStorage.setItem('user', JSON.stringify(user));
			} else {
				localStorage.removeItem('user');
			}

			setLoading(false);
		},
		[ user ]
	);

	return <AuthContext.Provider value={{ user, logIn, logOut, loading }} {...props} />;
}

export { AuthProvider, useAuth }