import catchAsyncErrors from '../middlewares/catchAsyncErrors.js'

import Order from "../models/order.js";
import Product from '../models/product.js';
import ErrorHandler from '../utils/errorHandler.js';


export const newOrder=catchAsyncErrors(async(req,res,next)=>{
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo,

    } =req.body

    const order=await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo,
        user:req.user._id,
    })
    res.status(200).json({
        order,
    })
})
//get curren user order
export const  myOrders=catchAsyncErrors(async(req,res,next)=>{
    const orders=await Order.find({user:req.user._id})

   
    res.status(200).json({
        orders,
    })
})
//get orders details
export const  getOrderDetails=catchAsyncErrors(async(req,res,next)=>{
    const order=await Order.findById(req.params.id).populate(
        'user',
        'name email'
    )

    if(!order){
        return next (new ErrorHandler('No Order found with this ID',404))
    }
    res.status(200).json({
        order,
    })
})

//get all order-ADMMIn
export const  allOrders=catchAsyncErrors(async(req,res,next)=>{
    const orders=await Order.find()

   
    res.status(200).json({
        orders,
    })
})
//update order - ADMIN
export const  updateOrder=catchAsyncErrors(async(req,res,next)=>{
    debugger;
    const order=await Order.findById(req.params.id)
 
    if(!order){
        return next (new ErrorHandler('No Order found with this ID',404))
    }
      
    if(order?.orderStatus==='Dilivered'){
        return next (new ErrorHandler('You have already delivered',400))
    }

    //update products stock
    order?.orderItems?.forEach(async(item)=>{
        const product=await Product.findById(item?.product?.toString())
        if(!product){
            return next (new ErrorHandler('No Order found with this ID',404))
        }
        product.stock=product.stock-item.quantity
        await product.save({validateBeforeSave:false})
    })
    order.orderStatus=req.body.status
    order.deliveredAt=Date.now()

    await order.save()
    res.status(200).json({
        success:true,
    })
})
//delete order - ADMIN
export const  deleteOrder=catchAsyncErrors(async(req,res,next)=>{
    const order=await Order.findById(req.params.id)

    
    if(!order){
        return next (new ErrorHandler('No Order found with this ID',404))
    }
    await order.deleteOne()

    res.status(200).json({
        success:true,
    })
})
    
    