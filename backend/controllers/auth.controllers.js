import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { sendOtpMail } from "../config/mail.js"
import { verifyFirebaseIdToken } from "../config/firebaseAdmin.js"

const setAuthCookie = (res, token) => {
    res.cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        httpOnly: true
    })
}

export const signUp = async(req,res)=>{
    try{
        const {fullName, email, password, mobileNumber, role} = req.body
        const normalizedEmail = email?.trim().toLowerCase()
        const normalizedMobile = mobileNumber?.toString().replace(/\D/g, "")

        const user = await User.findOne({email: normalizedEmail})
        if(user){
            return res.status(400).json({message:"User with given emailId already exists."})
        }
        if(password.length<6){
            return res.status(400).json({message:"Password must be atleast 6 characters"})
        }
        if(normalizedMobile.length!==10){
            return res.status(400).json({message:"Mobile number must be 10 digits"})
        }
        const hashedPassword = await bcrypt.hash(password,10)

        const newUser = await User.create({
            fullName: fullName?.trim(),
            email: normalizedEmail,
            role,
            mobileNumber: normalizedMobile,
            password:hashedPassword
        })
        
        const token = genToken(newUser._id)

        setAuthCookie(res, token)

        return res.status(201).json({newUser})
    }catch(error){
        return res.status(500).json({message:`Signup error :${error}`})
    }
}

export const signIn = async(req,res)=>{
    try{
        const {email, password} = req.body
        const normalizedEmail = email?.trim().toLowerCase()
        const user = await User.findOne({email: normalizedEmail})
        if(!user){
            return res.status(400).json({message:"User with given emailId does not exist."})
        }
        const MatchPassword = await bcrypt.compare(password,user.password)

        if(!MatchPassword){
            return res.status(400).json({message:"Incorrect password."})
        }
        
        const token = genToken(user._id)

        setAuthCookie(res, token)

        return res.status(200).json({user})
    }catch(error){
        return res.status(500).json({message:`Signup error :${error}`})
    }
}

export const signOut  = async(req,res)=>{
    try{
        res.clearCookie('token')
        res.status(200).json({message:`Signout successful`})
    }catch(error){
        res.status(500).json({message:`SignOut failed:${error}`})
    }
}

export const sendOtp = async(req,res)=>{
    try{
        const {email} = req.body;
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:'user doesnot exist'})
        }
        const otp = Math.floor(1000+Math.random()*9000).toString()
        user.resetOtp = otp
        user.otpExpires = Date.now()+2*60*1000
        user.isOtpVerified = false;
        await user.save()

        await sendOtpMail(email,otp)
        return res.status(200).json({message:"Otp sent successfully"})
    }catch(error){
        res.status(500).json({message:`Send Otp failed:${error}`})
    }
}

export const verifyOtp = async(req,res)=>{
    try{
        const {email,otp} = req.body
        const user = await User.findOne({email})
        if(!user || user.resetOtp!=otp || user.otpExpires<Date.now()){
            return res.status(400).json({message:"invalid/expired otp"})
        }
        user.isOtpVerified = true;
        user.resetOtp = undefined;
        user.otpExpires = undefined;
        await user.save();

   return res.status(200).json({message:"Otp verified successfully"})
    }catch(error){
        res.status(500).json({message:`verify Otp failed:${error}`})
    }
}

export const resetPassword = async(req,res)=>{
    try{
        const {email,newPassword} = req.body;
        const user = await User.findOne({email})
        if(!user || !user.isOtpVerified){
            return res.status(400).json({message:"otp verification required"})
        }
        const hashedpassword = await bcrypt.hash(newPassword,10);
        user.password = hashedpassword
        user.isOtpVerified = false;
        await user.save();
        return res.status(200).json({message:"Password reset successfully"})
    }catch(error){
        res.status(500).json({message:`reset password failed:${error}`})
    }
}

export const googleAuth=async(req,res)=>{
    try{
        const { idToken, fullName, mobileNumber, role } = req.body
        const decoded = await verifyFirebaseIdToken(idToken)
        const email = decoded?.email?.trim().toLowerCase()

        if (!email) {
            return res.status(400).json({ message: "Google account email not available." })
        }

        let user = await User.findOne({email})
        if(!user){
            const normalizedMobile = mobileNumber?.toString().replace(/\D/g, "")
            if (normalizedMobile.length !== 10) {
                return res.status(400).json({message:"Mobile number must be 10 digits for first-time Google signup"})
            }

            user=await User.create({
                fullName: fullName?.trim() || decoded?.name || "Google User",
                email,
                mobileNumber: normalizedMobile,
                role: role || "User"
            })
        }

        const token = genToken(user._id)

        setAuthCookie(res, token)
        return res.status(200).json({user})
    }catch(error){
        return res
            .status(error?.statusCode || 500)
            .json({message:error?.message || `Google auth error: ${error}`})
    }
}
