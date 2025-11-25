import { Request, Response } from 'express';
import { ContactService } from '../services/contactService';

export const submitContact = async (req: Request, res: Response) => {
	// 1. Extract data
	const { name, email, subject, message } = req.body;

	// 2. Call Service
	await ContactService.submitContact({ name, email, subject, message });

	// 3. Send Response
	res.status(200).json({ message: 'Contact form submitted successfully' });
};

