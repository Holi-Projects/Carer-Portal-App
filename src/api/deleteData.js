import authHeader from './auth-header';

/* The function used to trigger deleting of a record 
by validating the API call */

function deleteData(url) {
	const head = authHeader();

	// The API where we're fetching data from
	return new Promise(function(resolve, reject) {
		fetch(url, {
			method  : 'delete', // or 'PUT'
			headers : {
				'Content-Type' : 'application/json',
				charset        : 'UTF-8',
				Accept         : 'application/json',
				...head,
			},
		})
			// .then(response => response.json())
			// ...then we update the state of our application
			.then((result) => {
				// console.log(result);
				resolve(result);
			})
			// If we catch errors instead of a response, let's update the app
			.catch((error) => reject(error));
	});
}

export default deleteData;
