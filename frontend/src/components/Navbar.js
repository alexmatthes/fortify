import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem('token'); // Destroy the "VIP Pass"
		navigate('/login');
	};

	return (
		<nav style={styles.nav}>
			<div style={styles.brand}>Fortify</div>
			<div style={styles.links}>
				<Link to="/" style={styles.link}>
					Dashboard
				</Link>
				<Link to="/rudiments" style={styles.link}>
					Library
				</Link>
				<button onClick={handleLogout} style={styles.logoutBtn}>
					Logout
				</button>
			</div>
		</nav>
	);
}

const styles = {
	nav: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: '1rem 2rem',
		backgroundColor: '#282c34',
		color: 'white',
	},
	brand: { fontSize: '1.5rem', fontWeight: 'bold' },
	links: { display: 'flex', gap: '20px', alignItems: 'center' },
	link: { color: 'white', textDecoration: 'none', fontSize: '1.1rem' },
	logoutBtn: {
		padding: '5px 10px',
		backgroundColor: '#dc3545',
		color: 'white',
		border: 'none',
		borderRadius: '4px',
		cursor: 'pointer',
	},
};

export default Navbar;
