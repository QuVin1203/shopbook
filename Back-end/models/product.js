import mongoose from "mongoose";
const productSchema=new mongoose.Schema({
    name:{
        type:String,
        require:[true,'Please enter the product name'],
        maxLength:[200,'Product name cannot 200 characters']
    },
    price:{
        type:Number,
        required:[true,'Please enter the product price'],
        maxLength:[5,'Product name cannot 5 digits']

    },
    description:{
        type:String,
        required:[true,'Please enter the product description'],
    

    },
    ratings:{
        type: Number,
        default:0,
    },
    image:[
        {
            public_id:{
                type:String,
                required:false,
            },
            url:{
            type:String,
            required:true,
        },
    },
],
    category:{
        type : String,
        required:[true,'Please enter the product category'],
        enum:{
            values:[
                'Romance',
                'Fantasy',
                'Mystery',
                'Thriller',
                'Classics',
                'History',
                'Crime',
                'Poetry',
                'Drama',

            ],
            message:'Please select the category'
        }

    },
    seller:{
        type:String,
        required:[true,'Please enter the product seller'],
    

    },
    stock:{
        type:Number,
        required:[true,'Please enter the product stock'],
    

    },
    numOfReviews:{
        type:String,
        default: 0
    },
    reviews:[
        {
            user:{
                type : mongoose.Schema.Types.ObjectId,
                ref:'User',
                required:true,
            },
            rating:{
                type: Number,
                required: true,

            },
            comment:{
                type:String,
                required:true,
            }
        }
    ],
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:false,
    },
    //createdAt:{
        //type:Date,
        //default:Date.now,
    //}
},

    {timestamps:true}
)
export default mongoose.model('Product',productSchema)