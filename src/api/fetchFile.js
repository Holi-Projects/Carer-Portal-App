import authHeader from './auth-header';


/* The function used to get a file record 
by validating the API call */


function fetchFile(url) {
	const header = authHeader();

	//Checks that the token is valid before calling API
	if (header['x-access-token']) {
		return new Promise(function(resolve, reject) {
			fetch(url, { headers: header })
				//.then((response) => console.log(response.status))
				// ...then we update the state of our application
				.then((data) => {
					console.log(data);
					resolve(data);
				})
				// If we catch errors instead of a response, let's update the app
				.catch((error) => {
					// console.log(error);
					reject(error);
				});
		});
	} else {
		window.location.reload(true);
	}
}


export default fetchFile;

