import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import { PostHogProvider } from 'posthog-js/react';

const rootElement = document.getElementById('root');

if (rootElement) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<React.StrictMode>
			<PostHogProvider
				apiKey={process.env.REACT_APP_POSTHOG_KEY || ''}
				options={{
					api_host: process.env.REACT_APP_POSTHOG_HOST || 'https://us.i.posthog.com',
					defaults: '2025-05-24',
					capture_exceptions: true,
					debug: process.env.NODE_ENV === 'development',
				}}
			>
				<App />
			</PostHogProvider>
		</React.StrictMode>
	);
}

serviceWorkerRegistration.register();
reportWebVitals();