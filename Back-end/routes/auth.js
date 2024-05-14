import expresss from 'express'
import { allUsers, deleteUser, getUserDetails, getUserProfile, loginUser, logoutUser, registerUser, updatePassword, updateProfile, updateUser, uploadAvatar } from '../controllers/authController.js'
import { authorizeRoles, isAutheticatedUser } from '../middlewares/auth.js'
const router=expresss.Router()
router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(logoutUser)

router.route('/me').get(isAutheticatedUser,getUserProfile)
router.route('/me/update').put(isAutheticatedUser,updateProfile)
router.route('/password/update').put(isAutheticatedUser,updatePassword)
router.route('/me/upload_avatar').put(isAutheticatedUser,uploadAvatar)

router
.route('/admin/users')
.get(isAutheticatedUser,authorizeRoles('admin'),allUsers)
router
.route('/admin/users/:id')
.get(isAutheticatedUser,authorizeRoles('admin'),getUserDetails)
.put(isAutheticatedUser,authorizeRoles('admin'),updateUser)
.delete(isAutheticatedUser,authorizeRoles('admin'),deleteUser)

export default router