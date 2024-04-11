import User from "@/models/userModel";
import nodemailer  from "nodemailer";
import bcryptjs  from "bcryptjs";

export const sendEmail = async ({email,emailType,userId}:any) => {
    try {
        const hashedToken = await bcryptjs.hash(userId.toString(),10)

        if (emailType === 'VERIFY') {
          await User.findByIdAndUpdate(userId,{verifyToken:hashedToken, verifyTokenExpiry:Date.now()+3600000})
        }else if (emailType === 'RESET') {
          await User.findByIdAndUpdate(userId,{forgotPasswordToken:hashedToken, forgotPasswordTokenExpiry:Date.now()+3600000})
        }

        // const transporter = nodemailer.createTransport({
        //     host: "smtp.ethereal.email",
        //     port: 587,
        //     secure: false, // Use `true` for port 465, `false` for all other ports
        //     auth: {
        //       user: "maddison53@ethereal.email",
        //       pass: "jn7jnAPss4f63QBp6D",
        //     },
        //   });
        const transport = nodemailer.createTransport({
          host: "sandbox.smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: "c2b358d69a5782",
            pass: "8780b1b92cc5e4"
          }
        });
          const mailOptions={
            from: 'himanshu.sharma2020@sait.ac.in', // sender address
            to: email, // list of receivers
            subject: emailType === 'VERIFY' ? "Verify your email":"Reset your password", // Subject line
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here </a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"} or  copy and pase the link below in your browser.<br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>`, // html body
          }

         const mailResponse= await transport.sendMail(mailOptions)
         return mailResponse
    } catch (error:any) {
        throw new Error(error.message)
    }
}