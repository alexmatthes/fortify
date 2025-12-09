import { AlertTriangle, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import FormField from '../components/common/FormField';
import { Footer } from '../components/common/Footer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../services/api';
import { getErrorMessage, getFieldErrors } from '../utils/errorHandler';

const SettingsPage: React.FC = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [userEmail, setUserEmail] = useState('');
	const [showPasswordForm, setShowPasswordForm] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [audioSample, setAudioSample] = useState(localStorage.getItem('metronomeAudio') || 'beep');

	const [passwordData, setPasswordData] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});
	const [passwordErrors, setPasswordErrors] = useState<{ currentPassword?: string; newPassword?: string; confirmPassword?: string }>({});
	const [deletePassword, setDeletePassword] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		fetchProfile();
	}, []);

	const fetchProfile = async () => {
		try {
			const response = await api.get<{ email: string }>('/auth/profile');
			setUserEmail(response.data.email);
		} catch (error) {
			toast.error(getErrorMessage(error));
		} finally {
			setLoading(false);
		}
	};

	const handlePasswordChange = async (e: React.FormEvent) => {
		e.preventDefault();
		setPasswordErrors({});

		if (passwordData.newPassword !== passwordData.confirmPassword) {
			setPasswordErrors({ confirmPassword: 'Passwords do not match' });
			return;
		}

		setIsSubmitting(true);
		try {
			await api.put('/auth/change-password', {
				currentPassword: passwordData.currentPassword,
				newPassword: passwordData.newPassword,
			});
			toast.success('Password changed successfully');
			setShowPasswordForm(false);
			setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
		} catch (error) {
			const fieldErrors = getFieldErrors(error);
			if (Object.keys(fieldErrors).length > 0) {
				setPasswordErrors(fieldErrors);
			} else {
				toast.error(getErrorMessage(error));
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteAccount = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			await api.delete('/auth/account', { data: { password: deletePassword } });
			toast.success('Account deleted successfully');
			localStorage.removeItem('token');
			navigate('/');
		} catch (error) {
			toast.error(getErrorMessage(error));
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleAudioChange = (value: string) => {
		setAudioSample(value);
		localStorage.setItem('metronomeAudio', value);
		toast.success('Audio preference saved');
	};

	if (loading) {
		return <LoadingSpinner fullPage message="Loading settings..." />;
	}

	return (
		<div className="min-h-screen bg-dark-bg p-8 text-signal">
			<div className="max-w-2xl mx-auto">
				<h1 className="text-3xl md:text-4xl font-heading font-semibold mb-10 text-signal">Settings</h1>

				<section className="mb-8">
					<h2 className="text-xl font-heading font-semibold mb-6 text-signal">Profile</h2>
					<div className="bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] border border-[rgba(238,235,217,0.1)] rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
						<FormField label="Email">
							<input
								disabled
								type="text"
								value={userEmail}
								className="w-full bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] border border-[rgba(238,235,217,0.1)] rounded-lg px-4 h-[50px] text-[rgba(238,235,217,0.4)] cursor-not-allowed"
							/>
						</FormField>
						{!showPasswordForm ? (
							<Button variant="secondary" onClick={() => setShowPasswordForm(true)} className="mt-4">
								Change Password
							</Button>
						) : (
							<form onSubmit={handlePasswordChange} className="mt-4 space-y-4">
								<FormField label="Current Password" error={passwordErrors.currentPassword} required>
									<input
										type="password"
										required
										className={`w-full bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] border rounded-lg px-4 h-[50px] text-signal focus:outline-none transition-all duration-200 ${
											passwordErrors.currentPassword ? 'border-red-400 focus:border-red-400' : 'border-[rgba(238,235,217,0.1)] focus:border-[rgba(238,235,217,0.5)]'
										}`}
										value={passwordData.currentPassword}
										onChange={(e) => {
											setPasswordData({ ...passwordData, currentPassword: e.target.value });
											if (passwordErrors.currentPassword) setPasswordErrors({ ...passwordErrors, currentPassword: undefined });
										}}
									/>
								</FormField>
								<FormField label="New Password" error={passwordErrors.newPassword} required>
									<input
										type="password"
										required
										className={`w-full bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] border rounded-lg px-4 h-[50px] text-signal focus:outline-none transition-all duration-200 ${
											passwordErrors.newPassword ? 'border-red-400 focus:border-red-400' : 'border-[rgba(238,235,217,0.1)] focus:border-[rgba(238,235,217,0.5)]'
										}`}
										value={passwordData.newPassword}
										onChange={(e) => {
											setPasswordData({ ...passwordData, newPassword: e.target.value });
											if (passwordErrors.newPassword) setPasswordErrors({ ...passwordErrors, newPassword: undefined });
										}}
									/>
								</FormField>
								<FormField label="Confirm New Password" error={passwordErrors.confirmPassword} required>
									<input
										type="password"
										required
										className={`w-full bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] border rounded-lg px-4 h-[50px] text-signal focus:outline-none transition-all duration-200 ${
											passwordErrors.confirmPassword ? 'border-red-400 focus:border-red-400' : 'border-[rgba(238,235,217,0.1)] focus:border-[rgba(238,235,217,0.5)]'
										}`}
										value={passwordData.confirmPassword}
										onChange={(e) => {
											setPasswordData({ ...passwordData, confirmPassword: e.target.value });
											if (passwordErrors.confirmPassword) setPasswordErrors({ ...passwordErrors, confirmPassword: undefined });
										}}
									/>
								</FormField>
								<div className="flex gap-3">
									<Button type="submit" isLoading={isSubmitting}>
										Save Password
									</Button>
									<Button type="button" variant="secondary" onClick={() => setShowPasswordForm(false)}>
										Cancel
									</Button>
								</div>
							</form>
						)}
					</div>
				</section>

				<section className="mb-8">
					<h2 className="text-xl font-heading font-semibold mb-6 text-signal">Preferences</h2>
					<div className="bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] border border-[rgba(238,235,217,0.1)] rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
						<div className="flex items-center justify-between py-4 border-b border-[rgba(238,235,217,0.1)] last:border-0">
							<span className="text-[rgba(238,235,217,0.8)] font-medium">Metronome Sound</span>
							<select
								value={audioSample}
								onChange={(e) => handleAudioChange(e.target.value)}
								className="bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] border border-[rgba(238,235,217,0.1)] rounded-lg px-4 h-[50px] text-sm text-signal focus:border-[rgba(238,235,217,0.5)] outline-none transition-all duration-200"
							>
								<option value="beep">Digital Click</option>
								<option value="woodblock">Woodblock</option>
								<option value="cowbell">Cowbell</option>
							</select>
						</div>
					</div>
				</section>

				<section>
					<h2 className="text-xl font-heading font-semibold mb-6 text-signal text-red-400">Danger Zone</h2>
					<div className="bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] border border-red-400/30 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
						{!showDeleteConfirm ? (
							<div>
								<p className="text-[rgba(238,235,217,0.6)] mb-4">Permanently delete your account and all associated data.</p>
								<Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
									<Trash2 size={18} className="mr-2" />
									Delete Account
								</Button>
							</div>
						) : (
							<form onSubmit={handleDeleteAccount} className="space-y-4">
								<div className="flex items-start gap-3 p-4 bg-red-400/10 border border-red-400/30 rounded-lg">
									<AlertTriangle size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
									<p className="text-sm text-[rgba(238,235,217,0.8)]">
										This action cannot be undone. This will permanently delete your account, routines, and all practice session data.
									</p>
								</div>
								<FormField label="Confirm Password" required>
									<input
										type="password"
										required
										className="w-full bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] border border-red-400/30 rounded-lg px-4 h-[50px] text-signal focus:border-red-400 focus:outline-none transition-all duration-200"
										value={deletePassword}
										onChange={(e) => setDeletePassword(e.target.value)}
										placeholder="Enter your password to confirm"
									/>
								</FormField>
								<div className="flex gap-3">
									<Button type="submit" variant="danger" isLoading={isSubmitting}>
										<Trash2 size={18} className="mr-2" />
										Delete Account
									</Button>
									<Button type="button" variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
										Cancel
									</Button>
								</div>
							</form>
						)}
					</div>
				</section>
			</div>
			<Footer />
		</div>
	);
};

export default SettingsPage;
