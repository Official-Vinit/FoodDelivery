import jwt from "jsonwebtoken"
export const isAuth=async(req,res,next)=>{
    try{
        const token = req.cookies.token
        if(!token){
            return res.status(400).json({message:"Token not fount"})
        }
        const decodeToken = jwt.verify(token,process.env.JWT_SECRET)
        if(!decodeToken){
            return res.status(400).json({message:"Token not authenticated"})
        }
        req.userId = decodeToken.userId;
        return next()
    }catch(error){
        return res.status(500).json({message:"Token auth error: "+error})
    }
}