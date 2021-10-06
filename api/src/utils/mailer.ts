import nodemailer from 'nodemailer';

export const pitchReviewMail = async (toEmail:string) => {
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
      service: "gmail",
        auth: {
          user: process.env.MAIL_USER, // generated ethereal user
          pass: process.env.MAIL_PASS // generated ethereal password
        },
        tls: {
          rejectUnauthorized:false
        }
      });
    
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: "h4i.ssw@gmail.com", // sender address
        to: toEmail, // list of receivers
        subject: "Hello", // Subject line
        text: "Hello world?", // plain text body
        html: "<h1>HOWDY</h1><b>Hello world?</b>", // html body
      });
      console.log("Message sent: %s", info.messageId);
}

