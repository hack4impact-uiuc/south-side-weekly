import nodemailer from 'nodemailer';
import { EmailMessage } from './mailer-templates';

export const sendMail = async (message: EmailMessage): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'h4i.ssw@gmail.com',
      pass: '&7jP#6N#7&5!Y7of',
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  // send mail with defined transport object
  await new Promise((resolve, reject) => {
    transporter.sendMail(message, (err, info) => {
      console.log('yoyoyo dis andy')
      if (err) {
        console.log(err);
        reject(err)
      } else {
        console.log(`Email sent: ${info.response}`);
        resolve(info)
      }
    })
  });
  
  
};
