import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs';

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    
    await dbConnect();
    
    try {

        const {username, email, password} = await request.json();
        
        const existingUserVerifiedByUsername = await UserModel.
        findOne({
            username,
            isVerified: true
        });

        if(existingUserVerifiedByUsername) {
            return Response.json({
                    success: false,
                    message: "Username already taken!!"
                },
                {
                    status: 400
                }
            );
        }

        const existingUserByEmail = await UserModel.findOne({email});

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if(existingUserByEmail) {

            if(existingUserByEmail.isVerified) {
                return Response.json({
                        success: false,
                        message: "user already registerd with this email!"
                    },
                    {
                        status: 400
                    }
                );
            } else {
                const hashedPassword = await bcrypt.hash(password,10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

                await existingUserByEmail.save();
            }

        } else {
            //if does not exist then store into database
            const hashedPassword = await bcrypt.hash(password,10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                password: hashedPassword,
                email,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessges: true,
                messages: []
            });

            await newUser.save();
        }

        //send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if(!emailResponse.success) {
            return Response.json({
                    success: false,
                    message: emailResponse.message
                },
                {
                    status: 500
                }
            );
        }

        return Response.json({
                success: true,
                message: "User registered successfully, please check your email to verify code!"
            },
            {
                status: 200
            }
        );

    } catch (error) {
        console.error("User registration failed!");
        return Response.json({
            message: "User registration failed",
            success: false
        },
        {
            status: 500
        }
    );
    }
}