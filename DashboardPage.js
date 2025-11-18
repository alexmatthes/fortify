import React, { useEffect, useState } from 'react';
import api from '../api';

import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { Line } from 'react-chartjs-2';

import Metronome from '../components/Metronome';

// This 'registers' the components Chart.js needs
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function DashboardPage() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [rudiments, setRudiments] = useState([]);

	const [selectedRudiment, setSelectedRudiment] = useState('');
	const [duration, setDuration] = useState('');
	const [tempo, setTempo] = useState('');

	const [stats, setStats] = useState(null);

	const [chartData, setChartData] = useState(null);

	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchAllData = async () => {
			try {
				// We'll set loading to true at the start
				setIsLoading(true);
				setError(null); // Clear any old errors

				// Fetch both things
				const rudimentResponse = await api.get('/rudiments');
				const statsResponse = await api.get('/dashboard/stats');

				// Set all your state
				setRudiments(rudimentResponse.data);
				setStats(statsResponse.data);
			} catch (error) {
				console.error('Failed to load dashboard:', error);
				setError('Failed to load your dashboard. Please try again.');
			} finally {
				// This *always* runs, after the try or the catch
				setIsLoading(false);
			}
		};

		fetchAllData();
	}, []);

	const handleSessionSubmit = async (event) => {
		event.preventDefault(); // Stop the form from refreshing

		if (!selectedRudiment || !duration || !tempo) {
			alert('Please fill out all fields.');
			return;
		}

		try {
			// Send the data to your new backend endpoint
			await api.post('/sessions', {
				rudimentId: selectedRudiment,
				duration: duration,
				tempo: tempo,
			});

			// If successful, close the modal and clear the form
			setIsModalOpen(false);
			setSelectedRudiment('');
			setDuration('');
			setTempo('');
			fetchDashboardStats();

			fetchDashboardStats();
		} catch (error) {
			console.error('Failed to save session:', error);

			alert('Failed to save session. Please try again.');
		}
	};

	const fetchDashboardStats = async (event) => {
		try {
			const response = await api.get('/dashboard/stats');

			setStats(response.data);
		} catch (error) {}
	};

	const handleChartRudimentChange = async (rudimentId) => {
		// 1. Correctly check for an empty string
		if (!rudimentId) {
			setChartData(null); // Clear the chart
			return;
		}

		try {
			// 2. Correctly format the API call as a query parameter
			const response = await api.get(`/dashboard/chart?rudimentId=${rudimentId}`);
			const sessions = response.data; // This is an array of session objects

			// 3. You MUST format the data for Chart.js
			const formattedChartData = {
				// 'labels' is the X-axis
				// We format the date to be more readable
				labels: sessions.map((session) => new Date(session.date).toLocaleDateString()),
				// 'datasets' is the Y-axis data
				datasets: [
					{
						label: 'Tempo (BPM)',
						// 'data' is an array of all the tempo values
						data: sessions.map((session) => session.tempo),
						borderColor: 'rgb(75, 192, 192)', // A nice teal color
						backgroundColor: 'rgba(75, 192, 192, 0.5)',
					},
				],
			};

			// 4. Save the formatted data to state
			setChartData(formattedChartData);
		} catch (error) {
			console.error('Failed to fetch chart data:', error);
		}
	};

	// This function handles the MODAL's dropdown
	const handleModalRudimentChange = async (rudimentId) => {
		// First, set the selected rudiment
		setSelectedRudiment(rudimentId);

		if (!rudimentId) {
			setTempo(''); // Clear tempo if they de-select
			return;
		}

		try {
			// Call your new "smart" endpoint
			const response = await api.get(`/rudiments/${rudimentId}/suggested-tempo`);
			const { suggested_tempo } = response.data;

			// Set the tempo state, which will auto-fill the input!
			setTempo(suggested_tempo);
		} catch (error) {
			console.error('Failed to get suggested tempo:', error);
			setTempo(''); // Clear tempo on error
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
			<hr />

			{stats && (
				<div>
					<div>
						<h3>Total Practice Time</h3>
						<p>{stats.totalTime} hours</p>
					</div>
					<div>
						<h3>Fastest Tempo</h3>
						<p>{stats.fastestTempo} BPM</p>
					</div>
					<div>
						<h3>Most Practiced</h3>
						<p>{stats.mostPracticed}</p>
					</div>
				</div>
			)}

			<button onClick={() => setIsModalOpen(true)}>Log New Practice Session</button>

			<select value={selectedRudiment} onChange={(e) => handleChartRudimentChange(e.target.value)} required>
				<option value="">Select Rudiment</option>
				{rudiments.map((rudiment) => (
					<option key={rudiment.id} value={rudiment.id}>
						{rudiment.name}
					</option>
				))}
			</select>

			{chartData && (
				<div style={{ width: '600px', height: '300px' }}>
					<h3>Speed Improvement</h3>
					<Line data={chartData} />
				</div>
			)}

			{isModalOpen && (
				<div style={styles.modalBackdrop}>
					<div style={styles.modalContent}>
						<h2>Log New Practice Session</h2>

						<form onSubmit={handleSessionSubmit}>
							{' '}
							{/* <-- ADD 'onSubmit' */}
							<div>
								<label>Rudiment</label>

								{/* ADD 'value' and 'onChange' */}
								<select value={selectedRudiment} onChange={(e) => handleModalRudimentChange(e.target.value)} required>
									<option value="">Select Rudiment</option>
									{rudiments.map((rudiment) => (
										<option key={rudiment.id} value={rudiment.id}>
											{rudiment.name}
										</option>
									))}
								</select>
							</div>
							<div>
								<label>Duration (minutes)</label>

								{/* ADD 'value' and 'onChange' */}
								<input type="number" placeholder="e.g., 30" value={duration} onChange={(e) => setDuration(e.target.value)} required />
							</div>
							<div>
								<label>Speed (BPM)</label>

								{/* ADD 'value' and 'onChange' */}
								<input type="number" placeholder="e.g., 120" value={tempo} onChange={(e) => setTempo(e.target.value)} required />
							</div>
							<div style={{ marginTop: '20px' }}>
								<button type="button" onClick={() => setIsModalOpen(false)}>
									Cancel
								</button>
								<button type="submit" style={{ marginLeft: '10px' }}>
									Save Session
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
			<Metronome />
		</div>
	);
}

const styles = {
	modalBackdrop: {
		position: 'fixed',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark semi-transparent
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 1000,
	},
	modalContent: {
		backgroundColor: '#fff',
		padding: '20px',
		borderRadius: '8px',
		boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
		color: '#333', // Dark text for the light modal
	},
};

export default DashboardPage;
