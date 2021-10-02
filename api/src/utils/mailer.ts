import nodemailer from 'nodemailer'

export const sendMail = async (toEmail:string, content:string) => {
    let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
        
    })
}