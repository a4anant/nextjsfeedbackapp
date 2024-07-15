import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import VerificationEmail from '../../emails/VerficationEmail';
import { ApiResponse } from "@/types/ApiResponse";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {

    try {
        
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification code',
            react: VerificationEmail({username, otp:verifyCode}),
        });
        
        return { success: true, message: "Verification email send successfully!"}    
    } catch (errorEmail) {
        console.error("Error sending verification email", errorEmail);
        return { success: false, message: "Failed to send verification email"}       
    }
} 