"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitContact = void 0;
const contactService_1 = require("../services/contactService");
const submitContact = async (req, res) => {
    // 1. Extract data
    const { name, email, subject, message } = req.body;
    // 2. Call Service
    await contactService_1.ContactService.submitContact({ name, email, subject, message });
    // 3. Send Response
    res.status(200).json({ message: 'Contact form submitted successfully' });
};
exports.submitContact = submitContact;
