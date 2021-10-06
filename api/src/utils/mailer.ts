import nodemailer from 'nodemailer'

export const sendMail = async (toEmail:string, subject:string, content:string) : Promise<string> => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASS
        }, 
        tls: {
            rejectUnauthorized: false
        }
    });
    // send mail with defined transport object
    const info = transporter.sendMail({
        from: process.env.EMAIL_USERNAME, // sender address
        to: toEmail, // list of receivers
        subject: subject, // Subject line
        text: content, // plain text body
    });
    return "success";
}
