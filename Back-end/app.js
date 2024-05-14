import express from 'express'

const app=express()

import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
dotenv.config({path:'Back-end/config/config.env'})

//
process.on('uncaughtException',(err)=>{
    console.log(`ERROR: ${err}`)
    console.log('Shutting down server due to uncaught exception')
    
        process.exit(1)
   
})

//connecting db
connectDB()

app.use(express.json({limit:'10mb'}))
app.use(cookieParser())

//import all routes
import productRoutes from './routes/products.js'
import authRoutes from './routes/auth.js'
import orderRoutes from './routes/order.js'
import { connectDB } from './config/dbConnect.js'
import errorMiddlewares from './middlewares/errors.js'



app.use('/api/v1', productRoutes)
app.use('/api/v1', authRoutes)
app.use('/api/v1', orderRoutes)


//using error middlewares
app.use(errorMiddlewares)


const server=app.listen(process.env.PORT,()=>{
    console.log(`Server start  on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode`)
})

//handle unhandle promise rejection:dùng để hiện ra lỗi
process.on('unhandledRejection',(err)=>{
    console.log(`ERROR: ${err}`)
    console.log('Shutting down server due to Unhandled Promise Rejection')
    server.close(()=>{
        process.exit(1)
    })
})