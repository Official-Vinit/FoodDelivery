import nodemailer from "nodemailer"

const getTransporter = () => {
  const email = process.env.EMAIL?.trim()
  const appPassword = process.env.APP_PASSWORD?.trim()

  if (!email || !appPassword) {
    throw new Error("Missing EMAIL or APP_PASSWORD in backend .env")
  }

  return nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: email,
      pass: appPassword,
    },
  })
}

export const sendOtpMail=async(to,otp)=>{
    const transporter = getTransporter()
    await transporter.sendMail({
        from:`FoodZiee <${process.env.EMAIL?.trim()}>`,
        to,
        subject:"Reset Your Password",
        html:`<p>Your OTP for password reset is <b>${otp}</b>. It expires in 2 minutes</p>`
    })
}
