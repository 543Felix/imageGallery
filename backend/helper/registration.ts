import {authenticator} from 'otplib'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

import {senderMail,senderMailPassword,refreshTokenSecretKey,accessTokenSecretKey} from '../envVariables/envVariables'

 function generateOtp():number{
    let otp = authenticator.generateSecret()
    const token = authenticator.generate(otp)
    return Number(token)
}

function generateToken(data:any){
    const payload ={
      data
    }
      let accessToken = jwt.sign(payload,accessTokenSecretKey,{expiresIn:'15s'})
      let refreshToken = jwt.sign(payload,refreshTokenSecretKey,{expiresIn:'7d'})
    return  {
        accessToken,
        refreshToken
      }
   
  }

const sendOTP = async(email:string,otp:number):Promise<void>=>{
    const transporter = nodemailer.createTransport({
       service: 'gmail',
       auth: {
         user: senderMail,
         pass: senderMailPassword,
       },
    });
   
    const mailOptions = {
       from: senderMail,
       to: email,
       subject: 'Your OTP',
       text: `Your OTP is: ${otp}`,
    };
   
    await transporter.sendMail(mailOptions);
   }


   export const registerHelper = {
    generateOtp,
    generateToken,
    sendOTP,
}


