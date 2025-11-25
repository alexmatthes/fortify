<!-- bfd30b33-ca64-4fc9-a3b1-79b82ccb2c59 dcd63086-e627-42bb-a508-51a500b348a5 -->
# Email Service Integration with Resend

## Overview

Integrate Resend API to send two emails when a contact form is submitted:

1. **Admin notification email** - Alert to support team about new submission
2. **User auto-reply email** - Confirmation email to the person who submitted the form

## Implementation Steps

### 1. Install Resend Package

- Add `resend` npm package to `backend/package.json`
- Run `npm install` in backend directory

### 2. Update Configuration (`backend/config/index.ts`)

- Add email-related environment variables to Config interface:
  - `resendApiKey: string` - Resend API key (required)
  - `adminEmail: string` - Support/admin email address (required)
  - `fromEmail: string` - "From" address for emails (required, should be verified domain in Resend)
  - `replyToEmail?: string` - Optional reply-to address
- Add validation for these environment variables in `getConfig()` function
- Export email configuration alongside existing config

### 3. Create Email Service (`backend/services/emailService.ts`)

- Create new `EmailService` class with Resend client initialization
- Implement `sendContactNotification(data)` method:
  - Sends email to admin with form submission details
  - Subject: "New Contact Form Submission: [Subject]"
  - Include: name, email, subject, message, timestamp
  - Format as HTML email with clean structure
- Implement `sendContactAutoReply(data)` method:
  - Sends confirmation email to user
  - Subject: "Thank you for contacting Fortify"
  - Friendly, professional tone acknowledging receipt
  - Include their submitted message for reference
- Add error handling and logging for email failures
- Use winston logger for email send attempts and failures

### 4. Update Contact Service (`backend/services/contactService.ts`)

- Replace TODO comments with actual email sending logic
- Call both `EmailService.sendContactNotification()` and `EmailService.sendContactAutoReply()`
- Wrap in try-catch to handle email failures gracefully
- Log email sending attempts and any errors
- If email sending fails, log error but don't fail the contact submission (graceful degradation)

### 5. Environment Variables Setup

- Create/update `.env.example` in backend root with:
  ```
  RESEND_API_KEY=re_xxxxx
  ADMIN_EMAIL=support@fortifydrums.com
  FROM_EMAIL=noreply@fortifydrums.com
  REPLY_TO_EMAIL=support@fortifydrums.com (optional)
  ```

- Document that user needs to:

  1. Sign up for Resend account
  2. Get API key from Resend dashboard
  3. Verify sending domain in Resend
  4. Use verified domain email for FROM_EMAIL

### 6. Error Handling

- Ensure email failures don't break contact form submission
- Return success response even if emails fail (but log the error)
- Consider adding retry logic for transient email failures (optional)

## Verification & Testing

### 7. Manual Testing Steps

1. **Setup Verification:**

   - Set environment variables in `.env` file
   - Start backend server and verify no config errors
   - Check logs confirm email service initialized

2. **Email Sending Test:**

   - Submit contact form through frontend
   - Verify admin receives notification email
   - Verify user receives auto-reply email
   - Check email formatting and content

3. **Error Scenarios:**

   - Test with invalid API key (should log error but not crash)
   - Test with invalid email addresses
   - Test rate limiting behavior
   - Verify graceful degradation when emails fail

4. **Edge Cases:**

   - Test with very long messages
   - Test with special characters in name/message
   - Test with different subject types

### 8. Verification Checklist

- [ ] Resend API key configured and working
- [ ] Admin notification emails received successfully
- [ ] User auto-reply emails received successfully
- [ ] Email content is properly formatted
- [ ] Error handling works when API key is invalid
- [ ] Contact form still works even if emails fail
- [ ] Logs show email send attempts
- [ ] No crashes or unhandled errors

## Files to Modify/Create

**New Files:**

- `backend/services/emailService.ts` - Email service with Resend integration

**Modified Files:**

- `backend/config/index.ts` - Add email configuration
- `backend/services/contactService.ts` - Integrate email sending
- `backend/package.json` - Add resend dependency
- `.env.example` (if exists) - Add email environment variables

## Dependencies

- `resend` npm package (~latest version)