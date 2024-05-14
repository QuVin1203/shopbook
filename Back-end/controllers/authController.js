import catchAsyncErrors from '../middlewares/catchAsyncErrors.js'
import User from '../models/user.js'
import { delete_file, upload_file } from '../utils/cloudinary.js'
import ErrorHandler from '../utils/errorHandler.js'
import sendToken from '../utils/sendToken.js'


//register user /api/v1/register
export const registerUser = catchAsyncErrors(async(req,res,next)=>{
    const {name,email,password} = req.body   //dữ lieu nhập vào
    const user = await User.create({         //pthuc create tạo mới ng dùng
        name,
        email,
        password,

    })
    sendToken(user,201,res)  //gọi phương thức sendToken
    //res.status(201).json({
        //success:true,
    //})
   

})

//login user /api/v1/login
export const loginUser = catchAsyncErrors(async(req,res,next)=>{
    const {email,password} = req.body
   if(!email || !password){
    return next(new ErrorHandler('Please enter email and password',400))
   }
   //find the user in database
   const user = await User.findOne({email}).select('+password')

   if(!user){
    return next(new ErrorHandler('Invalid email and password',401))
   }
   //check if  password is correct
   const isPasswordMatched=await user.comparePassword(password)
   if(!isPasswordMatched){
    return next(new ErrorHandler('Invalid email and password',401))
   }
   sendToken(user,200,res)

})
//logout user
export const logoutUser=catchAsyncErrors(async(req,res,next) =>{
    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    })
    res.status(200).json({
        message:'Logout',
    })
})
// xóa cookie có tên 'token' bằng cách đặt giá trị của nó thành null. Thời gian hết hạn của cookie được đặt là ngay lập tức (new Date(Date.now())) để hết hiệu lực ngay lập tức. Tùy chọn httpOnly 
//được đặt là true để chỉ cho phép cookie được truy cập bởi HTTP và không được truy cập bởi mã JavaScript.

//Get current user profile  /api/v1/me
export const getUserProfile =catchAsyncErrors(async(req,res,next)=>{
    const user=await User.findById(req?.user?._id)

    res.status(200).json({
        user,
    })
})

//update password  /api/v1/password/update
export const updatePassword =catchAsyncErrors(async(req,res,next)=>{
    const user=await User.findById(req?.user?._id).select('+password')

    //check the previous user password
    const isPasswordMatched=await user.comparePassword(req.body.oldPassword)

    if(!isPasswordMatched){
        return next(new ErrorHandler('Old password is incorrect',400))
    }

    user.password=req.body.password
    user.save()

    res.status(200).json({
        success:true,
})
})

//update user profile  /api/v1/me/update
export const updateProfile=catchAsyncErrors(async(req,res,next)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email,

    }
    const user=await User.findByIdAndUpdate(req.user._id,newUserData,{
        new:true,
    })
    res.status(200).json({
        user,
    })
})

//get all user-admin   /api/v1/admin/user
export const allUsers=catchAsyncErrors(async(req,res,next)=>{
    const users=await User.find()
   
    res.status(200).json({
        users,
    })
})
//get  user detail  /api/v1/admin/user/:id
export const getUserDetails=catchAsyncErrors(async(req,res,next)=>{
    const user=await User.findById(req.params.id)
   
    if(!user){
    return next(new ErrorHandler(`User not found with id ${req.params.id}`,404))
}
    res.status(200).json({
        user,
    })
})
//update user details /api/v1/admin/users/:id
export const updateUser=catchAsyncErrors(async(req,res,next)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,

    }
    const user=await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
    })
    res.status(200).json({
        user,
    })
})

//delete user -admin  /api/v1/admin/user/:id
export const deleteUser=catchAsyncErrors(async(req,res,next)=>{
    const user=await User.findById(req.params.id)
   
    if(!user){
    return next(new ErrorHandler(`User not found with id ${req.params.id}`,404))
}

//TODO-remove user avatar from cloudinary
if(user?.avatar?.public_id){
    await delete_file(user?.avatar?.public_id)
}
await user.deleteOne()
    res.status(200).json({
        success:true,
    })
})
//upload avatar
export const uploadAvatar=catchAsyncErrors(async(req,res,next) =>{
    const avatarResponse=await upload_file(req.body.avatar,'shopbook/avatars')

    const user=await User.findByIdAndUpdate(res?.user?._id,{
        avatar:avatarResponse
    })
    res.status(200).json({
        user,
    })
})

