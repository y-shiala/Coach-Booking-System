import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendBookingConfirmation(
    customerEmail: string,
    customerName: string,
    coachEmail: string,
    coachName: string,
    serviceName: string,
    startTime: Date,
    totalPrice: number,
  ) {
    const depositAmount = (totalPrice / 2).toFixed(2);
    const formattedDate = new Date(startTime).toLocaleString();

  
    await this.mailerService.sendMail({
      to: customerEmail,
      subject: 'Booking Confirmed - Coach Booking System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Booking Confirmed! 🎉</h2>
          <p>Hi ${customerName},</p>
          <p>Your booking has been confirmed. Here are the details:</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Service:</strong> ${serviceName}</p>
            <p><strong>Coach:</strong> ${coachName}</p>
            <p><strong>Date & Time:</strong> ${formattedDate}</p>
            <p><strong>Total Price:</strong> $${totalPrice}</p>
            <p><strong>Deposit Paid:</strong> $${depositAmount}</p>
            <p><strong>Remaining Balance:</strong> $${depositAmount}</p>
          </div>
          <p>Please make sure to be available at the scheduled time.</p>
          <p>Thank you for using Coach Booking System!</p>
        </div>
      `,
    });

    
    await this.mailerService.sendMail({
      to: coachEmail,
      subject: 'New Booking Confirmed - Coach Booking System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Booking Confirmed!</h2>
          <p>Hi ${coachName},</p>
          <p>You have a new confirmed booking. Here are the details:</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Service:</strong> ${serviceName}</p>
            <p><strong>Customer:</strong> ${customerName}</p>
            <p><strong>Customer Email:</strong> ${customerEmail}</p>
            <p><strong>Date & Time:</strong> ${formattedDate}</p>
            <p><strong>Total Price:</strong> $${totalPrice}</p>
            <p><strong>Deposit Paid:</strong> $${depositAmount}</p>
          </div>
          <p>Please be prepared for the session at the scheduled time.</p>
          <p>Thank you for using Coach Booking System!</p>
        </div>
      `,
    });
  }
}