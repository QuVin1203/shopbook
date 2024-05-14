import ErrorHandler from "../utils/errorHandler.js"
import User from "../models/user.js"
import  jwt  from "jsonwebtoken"
import catchAsyncErrors from "./catchAsyncErrors.js"

//check if user is autheticated or not
export const isAutheticatedUser=catchAsyncErrors(async(req,res,next)=>{
   const {token}=req.cookies
    
    
    if(!token){
        return next(new ErrorHandler('Login firts to access this resource',401))
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET)//: Dùng phương thức jwt.verify() để giải mã token
    
    req.user=await User.findById(decoded.id) //Sau khi giải mã token thành công, ID của người dùng được trích xuất từ payload của token (decoded.id).
    // Sau đó, dùng ID này để tìm kiếm người dùng trong cơ sở dữ liệu

    next()
})

//middleware trong Express.js được sử dụng để xác minh tính xác thực của người dùng bằng cách kiểm tra 
//JWT token trong cookie và giải mã token để tìm ID của người dùng.

//authorize user role
export const authorizeRoles = (...roles)=>{
    return (req,res,next)=>{
        //if (!req.user || !req.user.role) {
            //return next(new ErrorHandler('User is not authenticated or does not have a role', 401));
        //}
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role ${req.user.role} is not allowed to access this resource`,403))
        }
        next()
    }
    
}