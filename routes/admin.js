var express = require("express");
const { getMaxListeners } = require("../app");
const adminController=require('../controllers/admincontroller/adminLogin')
const admincategorycontroller=require('../controllers/admincontroller/adminCategory')
const adminHelper=require('../helpers/adminHelpers/adminProductHelpers')
const adminusercontroller=require('../controllers/admincontroller/adminUsercontroller')
const adminproductcontroller=require('../controllers/admincontroller/product')
var router = express.Router();
const user = require("../models/connection");
const multer= require('multer');
const { doLogin } = require("../helpers/UserHelpers/UserHelpers");
const upload=require('../multer/multer')
const auths=require('../middlewares/middleware')

const check=require('../middlewares/admin-middleware');
const adminLogin = require("../controllers/admincontroller/adminLogin");



router.get("/signin",adminController.getsignin);

router.post("/signin",adminController.postsignin);

router.get("/",check.auth,auths.auth,adminController.getDashboard)

router.get("/login",check.auth,adminController.getAdminLogin);

router.post("/login",adminController.postAdminLogin)

router.get("/logout",check.auth,adminController.getAdminLogOut)
 
router.get("/view_users",check.auth,adminusercontroller.getViewUser)

router.get("/block_users/:id",check.auth, adminusercontroller.getBlockUser)

router.get("/unblock_users/:id", check.auth,adminusercontroller.getUnBlockUser)

router.get("/add_category",check.auth,admincategorycontroller.getCategory)

router.post("/add_category",check.auth,admincategorycontroller.postCategory)

router.get("/delete_category/:id",check.auth,admincategorycontroller.deleteCategory)

router.get("/edit_category",check.auth,admincategorycontroller.editCategory)

router.post("/edit_category",check.auth,admincategorycontroller.postEditCategory)

router.get("/add_product",check.auth,adminproductcontroller.getAddProduct)

router.post("/add_product",check.auth,upload.uploads,adminproductcontroller.postAddProduct)

router.get("/view_product",check.auth,adminproductcontroller.getViewproduct)

router.get("/edit_product",check.auth,adminproductcontroller.editViewProduct)

router.post("/edit_product",check.auth,upload.editeduploads,adminproductcontroller.postEditAddProduct)

router.get("/delete_product",check.auth,adminproductcontroller.deleteViewProduct)

router.get("/orders_list", check.auth, adminproductcontroller.getOrderList)

router.get("/order_details", check.auth, adminproductcontroller.getOrderDetails)


router.post("/order_details", check.auth, adminproductcontroller. postOrderDetails)

router.get("/find_subcategory", check.auth, adminproductcontroller. findSubcategory)

router.get("/view_admin", check.auth, adminController.getViewAdmins)

router.put("/block_admin", check.auth, adminController.blockAdmin)

router.put("/unblock_admin", check.auth, adminController.unBlockAdmin)

router.get("/order_page", check.auth, adminproductcontroller. orderPage)

router.get("/adminorder_details", check.auth, adminproductcontroller.adminOrderDetails)













module.exports = router;
