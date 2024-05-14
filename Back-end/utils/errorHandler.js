class ErrorHandler extends Error {
    constructor(message,statusCode){
        super(message)
        this.statusCode=statusCode

        //create  stack property
        Error.captureStackTrace(this,this.constructor)//tạo stack để lưu trữ thông tin lỗi
    }
}

export default ErrorHandler