import authHeader from './auth-header';

/* The function used to trigger an update of a 
record by validating the API call */

function updateData(url, data) {
	const head = authHeader();

	// The API where we're fetching data from
	console.log(data);
		return new Promise(function(resolve, reject) {
			fetch(url, {
				method  : 'PUT', // or 'PUT'
				body    : JSON.stringify(data),
				headers : {


					'Content-Type' : 'application/json',
					Accept         : 'application/json',
					...head,

				},
			})
				// ...then we update the state of our application
				.then((result) => {
					console.log(result);
					resolve(result);
				})
				// If we catch errors instead of a response, let's update the app
				.catch((error) => reject(error));
		});
}

export default updateData;
