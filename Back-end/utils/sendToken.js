//create token and save in the cookie
export default(user,statusCode,res)=>{

    //create JWT Token
    const token = user.getJwtToken()

    //Options for cookie
    const options={
        expires:new Date(Date.now()+process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 *1000),
        httpOnly:true,
    }
    res.status(statusCode).cookie('token',token,options).json({
        token,
    })
}



//nhận thông tin về người dùng và trả về một phản hồi HTTP chứa một JWT token, cũng như đặt một cookie c
//ó tên là 'token' để lưu trữ token đó trong trình duyệt của người dùng