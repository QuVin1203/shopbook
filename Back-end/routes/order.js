import express from "express";
const router=express.Router()

import { authorizeRoles, isAutheticatedUser } from "../middlewares/auth.js";
import { allOrders, deleteOrder, getOrderDetails, myOrders, newOrder, updateOrder } from "../controllers/orderController.js";
import { getSales } from "../controllers/productControllers.js";


router.route('/orders/new').post(isAutheticatedUser,newOrder)
router.route('/orders/:id').get(isAutheticatedUser,getOrderDetails)
router.route('/me/orders').get(isAutheticatedUser,myOrders)

router
.route('/admin/get_sales')
.get(isAutheticatedUser,authorizeRoles('admin'),getSales)

router
.route('/admin/orders')
.get(isAutheticatedUser,authorizeRoles('admin'),allOrders)

router
.route('/admin/orders/:id')
.put(isAutheticatedUser,authorizeRoles('admin'),updateOrder)
.delete(isAutheticatedUser,authorizeRoles('admin'),deleteOrder)


export default router