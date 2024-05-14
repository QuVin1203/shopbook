import mongoose from "mongoose";

const orderSchema=new mongoose.Schema({
    shippingInfo:{
        address:{
            type:String,
            required:true,
        },
        city:{
            type:String,
            required:true,

        },
        phoneNo:{
            type:String,
            required:true,

        },
        zipCode:{
            type:String,
            required:true,

        },
        country:{
            type:String,
            required:true,

        },
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    orderItems:[
        {
            name:{
                type:String,
                required:true,
            },
            quantity:{
                type:Number,
                required:true,

            },
            image:{
                type:String,
                required:false,

            },
            price:{
                type:String,
                required:true,

            },
            product:{
                type:mongoose.Schema.Types.ObjectId,
                required:true,
                ref:'Product'
            }
        }
    ],
    paymentMethod:{
        type:String,
        required:[true,'Please select the payment method'],
        enum:{
            values:['COD','CARD'],
            message:'Please select: COD or CARD'
        }
    },
    paymentInfo:{
        type:String,    
        default:'Unpaid',
    },
    itemsPrice:{
        type:Number,
        required:true,
    },
    taxAmount:{
        type:Number,
        required:true,
    },
    shippingAmount:{
        type:Number,
        required:true,
    },
    totalAmount:{
        type:Number,
        required:true,
    },
    // orderStatus:{
    //     type:String,
    //     enum:{
    //         values:['Proccessing','Shipped','Delivered'],
    //         message:'Please select correct order status'
    //     },
        
    //     default:'Proccessing'
    // },
    orderStatus: {
        type: String,
        enum: ['Processing', 'Shipped', 'Delivered'],
        default: 'Processing'
    },
    deliveredAt: {
        type: Date,
        default: null,
    }
    
},
{timeseries:true}
)

export default mongoose.model('Order',orderSchema)