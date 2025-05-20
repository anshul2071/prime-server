import nodemailer from "nodemailer"
import "dotenv/config"


const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
})



export const sendVerifcationEmail = async (
    to: string,
    token: string,

): Promise<void> => {
    const verfiyUrl = `${process.env.CLIENT_URL}/verify?token=${token}`
    
    await transporter.sendMail ({
        from: `Rawal Company Limited <${process.env.EMAIL_USER}>`,
        to,
        subject: `Please verify your email`,
        html: `<p> Welcome! Please click on the link to verify your email </p>
        <a href = "${verfiyUrl}">Verify Email </a>
        <p> If you did not request for this email please ignore this </p>
        `
    })
}