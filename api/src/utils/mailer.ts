import nodemailer from 'nodemailer';
import { EmailMessage } from './mailer-templates';

export const sendMail = async (message: EmailMessage): Promise<void> => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    // send mail with defined transport object
    transporter.sendMail(message, (err, info) => {
      console.log('yoyoyo dis andy')
      if (err) {
        console.log('error')
        console.log(err);
      } else {
        console.log('sent?')
        console.log(`Email sent: ${info.response}`);
      }
    });
  } catch (Error) {
    console.log(Error.message)
  }
  
};
