import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password:{
        type: String,
    },
    mobileNumber:{
        type: String,
        required: true,
        trim: true
    },
    role:{
       type: String,
       enum:["User","Shop Owner","Delivery Boy"],
       required: true
    },
    resetOtp:{
        type: String
    },
    isOtpVerified:{
        type:Boolean,
        default:false
    },
    otpExpires:{
        type:Date
    }
},{
    timestamps:true
})

const User = mongoose.model("User",userSchema)
export default User;
