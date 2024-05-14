import expresss from 'express'
import { canUserReview, createProductReview, deleteProduct, deleteProductImages, deleteReview, getAdminProduct, getProducDetails, getProductReview, getProducts, newProduct, updateProduct, uploadProductImages } from '../controllers/productControllers.js'
import { isAutheticatedUser } from '../middlewares/auth.js'
import { authorizeRoles } from '../middlewares/auth.js'
const router = expresss.Router()

router.route('/product').get(getProducts)
router
.route('/admin/product')
.post(isAutheticatedUser,authorizeRoles('admin'),newProduct)
.get(isAutheticatedUser,authorizeRoles('admin'),getAdminProduct)



router.route('/product/:id').get(getProducDetails)

router
.route('/admin/product/:id/upload_images')
.put(isAutheticatedUser,authorizeRoles('admin'),uploadProductImages)

router
.route('/admin/product/:id/delete_images')
.delete(isAutheticatedUser,authorizeRoles('admin'),deleteProductImages)


router
.route('/admin/product/:id')
.put(isAutheticatedUser,authorizeRoles('admin'),updateProduct)

router
.route('/admin/product/:id')
.delete(isAutheticatedUser,authorizeRoles('admin'),deleteProduct)

router.route('/reviews')
.put(isAutheticatedUser,createProductReview)
.get(isAutheticatedUser,getProductReview)
 
router
.route('/admin/reviews')
.delete(isAutheticatedUser,authorizeRoles('admin'),deleteReview)

router.route('/can_review').get(isAutheticatedUser,canUserReview)


export default router

