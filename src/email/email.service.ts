// src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    // Create a Nodemailer transporter using Mailtrap
    this.transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io', // Mailtrap SMTP host
      port: 2525, // Mailtrap SMTP port
      auth: {
        user: process.env.MAILTRAP_USER, // Your Mailtrap username
        pass: process.env.MAILTRAP_PASSWORD, // Your Mailtrap password
      },
    });
  }

  async sendEmail(to: string[], subject: string, text: string): Promise<void> {
      const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address
        to, // Recipient address
        subject, // Email subject
        text, // Email body
      };
      // Send the email
      const info = this.transporter.sendMail(mailOptions);

      // Log the email preview URL (for testing purposes)
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
}
