import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
import  jwt  from "jsonwebtoken";
import crypto from 'crypto'
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please enter your name'],
        maxLength:[200,'Your name cannot exceed 50 characters']
    },
    email:{
        type:String,
        required:[true,'Please enter your email'],
        unique:true,  //Đảm bảo rằng mỗi email là duy nhất
    },
    password:{
        type:String,
        required:[true,'Please enter your password'],
        minLength:[6,'Your password must be longer than 6 characters'],
        select:false,  //// Không lựa chọn trường mật khẩu mặc định
    },
    avatar:{
        type:String,
        default:'https://pc.net/img/terms/avatar.svg',
    },
    role:{
        type:String,
        default:'user',
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,

},
{timestamps:true}  //được sử dụng để tự động thêm hai trường createdAt và updatedAt vào mô hình của bạn
)


//encrypting password before saving the user
userSchema.pre('save',async function(next){   //pre : chạy mid trước khi save dữ liệu
    if(!this.isModified('password')){         //kiểm tra password có bị thay đổi hay k(modified)
        next()
    }
    this.password = await bcrypt.hash(this.password,10)  //sử dụng bcrypt để băm mật khẩu với mức độ độ phức tạp là 10
})


//return JWT Token
userSchema.methods.getJwtToken=function(){    //tạo phương thức getJwtToken ()
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{   //dùng pthuc sign từ thư viện Jwt để tạo token,thông tin bạn muốn đặt trong token
        expiresIn:process.env.JWT_EXPIRES_TIME//thời gian hết hạn của token
    })
}
//compare user password
userSchema.methods.comparePassword=async function(enteredPassword){  //tạo pthuc comparePassword ()
    return await bcrypt.compare(enteredPassword,this.password)
}

//general rest password token
userSchema.methods.getResetPasswordToken=function(){
    //Gernerate Token
    const resetToken=crypto.randomBytes(20).toString('hex')//tạo ra một chuỗi ngẫu nhiên có độ dài 20 ký tự và biểu diễn nó dưới dạng hex

    //Hash and set to resetPasswordToken field
    this.resetPasswordToken=crypto
    .createHash('sha256')//tạo hàm băm
    .update(resetToken)//cập nhật token
    .digest('hex')//trả về lại mả hex

    //set token expires time
    this.resetPasswordExpire=Date.now()+30*60*1000// Dòng này đặt thời gian hết hạn cho mã thông báo ( 30p)

    return resetToken

}
export default mongoose.model("User",userSchema)    






/*Kiến thức cốt lỗi cần ôn:
-mongose
-asyn
-next()
-await
-jwt(json web token)



*/
