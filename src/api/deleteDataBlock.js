function deleteDataBlock(url, data) {
	// The API where we're fetching data from
	return new Promise(function(resolve, reject) {
		fetch(url, {
			method  : 'delete', // or 'PUT'
			body    : JSON.stringify(data), // data can be `string` or {object}!
			headers : {
				'Content-Type' : 'application/json',
				charset      : 'UTF-8',
				Accept       : 'application/json',
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

export default deleteDataBlock;
