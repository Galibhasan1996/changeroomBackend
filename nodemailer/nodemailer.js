import nodemailer from "nodemailer"
import { config } from "../util/EnvVariabe.js";




export const sendEmail = async (email, token) => {

    const transporter = nodemailer.createTransport({
        // host: "gmail.com",
        // port: 587,
        // secure: false, // Use `true` for port 465, `false` for all other ports
        service: "gmail",
        auth: {
            user: config.get("NodeEmail_Email"),
            pass: config.get("nodeEmailPassword"),
        },
    });

    // const info = await transporter.sendMail({
    //     from: 'Changeroom', // sender address
    //     to: `${email}`, // list of receivers
    //     subject: "email varification", // Subject line
    //     text: `Varify your email : http://localhost:3000/api/v1/auth/verify/${token}`, // plain text body
    // });


    const info = await transporter.sendMail({
        from: config.get("NodeEmail_Email"), // sender address
        to: `${email}`, // recipient
        subject: "Verify Your Email - Changeroom", // Subject line
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
            <h2 style="color: #333; text-align: center;">Welcome to Changeroom! 🎉</h2>
            <p style="font-size: 16px; color: #555;">Thank you for signing up. To complete your registration, please verify your email by clicking the button below:</p>
            <div style="text-align: center; margin: 20px 0;">
                <a href="http://localhost:3000/api/v1/auth/verify/${token}" 
                style="background-color: #007bff; color: #fff; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">
                    Verify Email
                </a>
            </div>
            <p style="font-size: 14px; color: #777;">If you didn't sign up for Changeroom, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="text-align: center; font-size: 12px; color: #999;">&copy; 2025 Changeroom. All rights reserved.</p>
        </div>
        `,
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}



export const sendOTPMailer = async (receiverEmail, OTP) => {
    try {
        console.log("📧 Sending OTP to:", receiverEmail);

        // Create transporter
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // Use true for port 465
            requireTLS: true,
            auth: {
                user: config.get("NodeEmail_Email"),
                pass: config.get("nodeEmailPassword"),
            },
        });

        // Email content with styled HTML
        const emailBody = `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                <h2 style="color: #4CAF50;">Email Verification</h2>
                <p>Thank you for signing up! Please use the verification code below:</p>
                <h1 style="background: #4CAF50; color: white; display: inline-block; padding: 10px 20px; border-radius: 5px;">
                    ${OTP}
                </h1>
                <p>If you didn't request this code, you can safely ignore this email.</p>
                <br>
                <small style="color: #777;">This code is valid for a limited time.</small>
            </div>
        `;

        // Send email
        const info = await transporter.sendMail({
            from: `"Support Team" <${config.get("NodeEmail_Email")}>`,
            to: receiverEmail,
            subject: "🔐 Email Verification Code",
            text: `Your verification code is: ${OTP}`,
            html: emailBody,
        });

        console.log("✅ Email sent successfully! Message ID:", info.messageId);
        return true;
    } catch (error) {
        console.error("❌ Error sending email:", error);
        return false;
    }
};
