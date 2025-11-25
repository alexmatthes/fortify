import logger from '../utils/logger';

interface ContactSubmission {
	name: string;
	email: string;
	subject: string;
	message: string;
}

export class ContactService {
	/**
	 * Submit a contact form
	 * TODO: In production, integrate with email service (e.g., SendGrid, AWS SES)
	 */
	static async submitContact(data: ContactSubmission): Promise<void> {
		// Log the contact submission for now
		// In production, this would send an email notification
		logger.info('Contact form submission received:', {
			name: data.name,
			email: data.email,
			subject: data.subject,
			messageLength: data.message.length,
		});

		// TODO: Implement email sending logic here
		// Example: await emailService.sendContactEmail(data);

		// For now, we just log it. In production, you would:
		// 1. Send email to support/admin
		// 2. Optionally store in database for tracking
		// 3. Send auto-reply to user
	}
}

