import React, { useEffect, useState } from 'react';
import api from '../api';

function LibraryPage() {
	//Create an empty array to hold the list of rudiments.
	const [rudiments, setRudiments] = useState([]);
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [category, setCategory] = useState('');

	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	// This 'useEffect' hook runs once when the component loads,
	// because its "dependency array" [] is empty.
	useEffect(() => {
		// We define an 'async' function inside so we can use 'await'
		const fetchRudiments = async () => {
			try {
				// Use your 'api' helper to make the GET request
				// It automatically has the baseURL and the token!
				const response = await api.get('/rudiments');

				// 'response.data' is the array of rudiments from your backend
				// We save this array into our state.
				setRudiments(response.data);
			} catch (error) {
				// If the token is bad or the server is down, this will run
				console.error('Failed to fetch rudiments:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchRudiments(); // Call the function to make it run
	}, []); // The empty [] means "only run this once"

	const handleCreateSubmit = async (event) => {
		event.preventDefault(); // Stop the form from refreshing the page

		try {
			// Send the new rudiment data to your POST endpoint
			await api.post('/rudiments', {
				name: name,
				description: description,
				category: category,
			});

			const response = await api.get('/rudiments');
			setRudiments(response.data);

			// Clear the form fields
			setName('');
			setDescription('');
			setCategory('');
		} catch (error) {
			console.error('Failed to create rudiment:', error);
		}
	};

	const handleDelete = async (idToDelete) => {
		try {
			// Use a "template literal" (backticks ``) to build the URL
			await api.delete(`/rudiments/${idToDelete}`);

			// Just like creating, we re-fetch the list to update the UI
			const response = await api.get('/rudiments');
			setRudiments(response.data);
		} catch (error) {
			console.error('Failed to delete rudiment:', error);
		}
	};

	if (isLoading) {
		return <div>Loading your dashboard...</div>;
	}

	if (error) {
		return <div style={{ color: 'red' }}>{error}</div>;
	}

	return (
		<div>
			<h1>Rudiment Library Page</h1>

			<form onSubmit={handleCreateSubmit}>
				<h3>Add a New Rudiment</h3>
				<div>
					<label>Name: </label>
					<input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
				</div>
				<div>
					<label>Description: </label>
					<input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
				</div>
				<div>
					<label>Category: </label>
					<input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
				</div>
				<button type="submit">Add Rudiment</button>
			</form>

			<hr />

			<div>
				{rudiments.map((rudiment) => (
					<div key={rudiment.id} style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
						<h3>{rudiment.name}</h3>
						<p>Category: {rudiment.category}</p>
						<p>Description: {rudiment.description}</p>

						<button onClick={() => handleDelete(rudiment.id)}>Delete</button>
					</div>
				))}
			</div>
		</div>
	);
}

export default LibraryPage;
