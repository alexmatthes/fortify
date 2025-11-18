import axios from 'axios';

// 1. Create the instance AND save it to a variable named 'api'
const api = axios.create({
	baseURL: 'http://localhost:8000/api',
});

// 2. Add the interceptor *to your new instance* ('api')
//    .use() takes a function (the 'config' callback) as its argument
api.interceptors.request.use(
	(config) => {
		// 3. Get the token from localStorage *inside* this function
		//    This makes sure you always get the latest token.
		const token = localStorage.getItem('token');

		// 4. If a token exists, add it to the Authorization header
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		// 5. CRITICAL: You MUST return the config object,
		//    or the request will stop and go nowhere.
		return config;
	},
	(error) => {
		// Handle any request errors
		return Promise.reject(error);
	}
);

// 6. Export the 'api' instance directly
export default api;
