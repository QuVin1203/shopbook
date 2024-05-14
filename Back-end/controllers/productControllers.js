import { query } from 'express'
import Product from '../models/product.js'
import APIFilters from '../utils/apiFilter.js'
import ErrorHandler from '../utils/errorHandler.js'
import catchAsyncErrors from '../middlewares/catchAsyncErrors.js'
import Order from '../models/order.js'
import {delete_file, upload_file} from '../utils/cloudinary.js'



//getProduct       /api/v1/product
export const getProducts = catchAsyncErrors(async (req,res) => {
    const resPerPage=4
    const apiFilters=new APIFilters(Product,req.query).search().filters()

    let products=await apiFilters.query
    let filteredProductsCount=products.length

    //return next(new ErrorHandler('Products Error',400))

    apiFilters.pagination(resPerPage)
    products=await apiFilters.query.clone()
    res.status(200).json({
        resPerPage,
        filteredProductsCount,
        products,
    })

})




//create new product     /api/v1/admin/product
//asyn,await xữ lí bất đồng bộ, cho phép tiếp tục xử lý các yêu cầu khác
// trong khi đợi cho việc tạo sản phẩm hoàn thành.
export const newProduct = catchAsyncErrors(async (req,res)=> {

    req.body.user = req.user._id
    const product = await Product.create(req.body)//tạo sản phẩm dựa trên yếu cầu.body và lưu về biế product

    res.status(200).json({
        product,   //trả về sản phẩm product=json
    })

})






//get single product  /api/v1/product/:id
export const  getProducDetails = catchAsyncErrors( async (req,res,next)=>{ 
    const product=await Product.findById(req?.params?.id).populate('reviews.user')

    if(!product){
    return next(new ErrorHandler('Product not found',404))  //dùng ErrorHandler để bắt lỗi 
}
res.status(200).json({
    product,
})
})

//get product admin
export const  getAdminProduct = catchAsyncErrors( async (req,res)=>{ 
    const product=await Product.find()

    res.status(200).json({
        product,
    })
})






//update product  /api/v1/product/:id
export const  updateProduct = catchAsyncErrors( async (req,res)=>{ 
    let product=await Product.findById(req?.params?.id) //?. là một phần của Optional Chaining cho phép bạn truy cập 
    //các thuộc tính của một object mà không cần kiểm tra xem object đó có tồn tại hay không

    if(!product){
    return res.status(404).json({
     error:'Product not exist'
})
}
product=await Product.findByIdAndUpdate(req?.params?.id,req.body,{new:true})//{new: true} yêu cầu trả về bản ghi mới sau khi nó đã được cập nhật trong cơ sở dữ liệu.
res.status(200).json({
    product,
})

})
//upload img
export const  uploadProductImages = catchAsyncErrors( async (req,res,next)=>{ 
    let product=await Product.findById(req?.params?.id) 

    if(!product){
    return next(new ErrorHandler('Product not found',404))
}
const uploader=async(image)=>upload_file(image,'shopbook/products')

const urls=await Promise.all((req?.body?.images).map(uploader))

product?.image?.push(...urls)
await product?.save()

res.status(200).json({
    product,
})
})
//delete img
export const  deleteProductImages = catchAsyncErrors( async (req,res,next)=>{ 
    let product=await Product.findById(req?.params?.id) 

    if(!product){
    return next(new ErrorHandler('Product not found',404))
}
const isDelete=async(image)=>delete_file(req.body.imgId)

if(isDelete){
    product.image=product?.image?.filter(
        (img)=>img.public_id !== req.body.imgId
    )
}


await product?.save()

res.status(200).json({
    product,
})




})

//delete product  /api/v1/product/:id
export const  deleteProduct = catchAsyncErrors(async (req,res)=>{ 
    let product=await Product.findById(req?.params?.id) //?. là một phần của Optional Chaining cho phép bạn truy cập 
    //các thuộc tính của một object mà không cần kiểm tra xem object đó có tồn tại hay không

    if(!product){
    return res.status(404).json({
     error:'product not exist'
})
}
//delete with image
for(let i=0;i<product?.image?.length;i++){
    await delete_file(product?.image[i].public_id)
}
await product.deleteOne()
res.status(200).json({
    message:'product  deleted'
})
})




//add review for product
export const createProductReview=catchAsyncErrors(async(req,res)=>{
    const {rating,comment,productId}=req.body

    const review={
        user:req?.user?._id,
        rating:Number(rating),
        comment,

    }
    const product=await Product.findById(productId)

    if(!productId){
        return next(new ErrorHandler('Product not found',404))
    }
    const isReview=product?.review?.find(
        (r)=>r.user.toString()===req?.user?._id.toString()
    )
    if(isReview)
    {
        product.reviews.forEach((review)=>{
            if(review?.user?.toString()===req?.user?._id.toString()){
                review.comment=comment
                review.rating=rating
            }
        })
        
    }
    else{
        product.reviews.push(review)
        product.numOfReviews=product.reviews.length
    }
    product.ratings=
    product.reviews.reduce((acc,item)=>item.rating+acc,0)/
    product.reviews.length

    await product.save({validateBeforeSave:false})
    res.status(200).json({
        success:true
    })

})
//get all review of products
export const getProductReview=catchAsyncErrors(async(req,res)=>{
    const product=await Product.findById(req.query.id)

    if(!product){
        return next(new ErrorHandler('Product not found',404))
    }
    res.status(200).json({
        reviews:product.reviews,
    })
})
//delete product review
export const deleteReview=catchAsyncErrors(async(req,res,next)=>{
    const  product=await Product.findById(req.query.productId)

    if(!product){
        return next(new ErrorHandler('Product not found',404))
    }
   const reviews= product.reviews=product?.reviews?.filter(
        (review)=>review._id.toString()!==req?.query?.id.toString()
    )
    const numOfReviews=product.reviews.length
    const ratings=
    numOfReviews===0
    ?0
     :product.reviews.reduce((acc,item)=>item.rating+acc,0) /
    numOfReviews

    await Product.findByIdAndUpdate(
        req.query.productId,
        {reviews,numOfReviews,ratings},
        {new:true}
    )

    
    
    res.status(200).json({
        success:true,
        product,
    })



})
//can user review  /api/v1/can_review
export const  canUserReview = catchAsyncErrors( async (req,res)=>{ 
    let orders=await Order.find({
        user:req.user._id,
        'orderItems.product':req.query.productId,
    }) 

    if(orders.length===0){
    return res.status(200).json({
     canReview:false
})
}
res.status(200).json({
    canReview:true,
})
})

//
async function getSalesData(startDate,endDate){
    const salesData=await Order.aggregate([
        {
            //stage 1 -filter result
            $match:{
                createdAt:{
                    $gte:new Date(startDate),
                    $lte:new Date(endDate),
                },
            },
        },
        {
        //stage 2-group data
        $group:{
            _id:{
                date:{$dateToString:{format:'%Y-%m%d',date:'$createdAt'}},
            },
            totalSales:{$sum:'$totalAmount'},
            numOrder:{$sum:1},//count the number of orders
        },
    },
    ])

//create map 
const salesMap=new Map()
let totalSales=0
let totalNumOrders=0

salesData.forEach((entry)=>{
    const date=entry?._id.date
    const sales=entry?.totalSales
    const numOrders=entry?._id.numOrders

    salesMap.set(date,{sales,numOrders})
    totalSales+=sales
    totalNumOrders+=numOrders
})
//gernate
const datesBetween=getDatesBetween(startDate,endDate)

//
const finalSalesData=datesBetween.map((date)=>({
    data,
    sales:(salesMap.get(date) || {sales:0}).sales,
    numOrders:(salesMap.get(date) ||{numOrders:0}).numOrders

}))
return {salesData:finalSalesData,totalSales,totalNumOrders}
}
function getDatesBetween(startDate,endDate){
    const dates=[]
    let currentDate=new Date(startDate)

    while(currentDate <= new Date(endDate)){
        const formattedDate=currentDate.toISOString().split('Y')[0]
        dates.push(formattedDate)
        currentDate.setDate(currentDate.getDate()+1)
    }
    return dates
}

//getsales data /api/v1/admin/get_sales
export const  getSales = catchAsyncErrors( async (req,res,next)=>{ 
    const startDate=new Date(req.query.startDate)
    const endDate=new Date(req.query.endDate)

    startDate.setHours(0,0,0,0)
    endDate.setHours(23,59,59,999)
    const {salesData,totalSales,totalNumOrders}=getSalesData(
        startDate,
        endDate
    )

    res.status(200).json({
        totalSales,
        totalNumOrders,
        sales:salesData,
    })
})
