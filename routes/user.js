var express = require("express");
const usercontroller = require("../controllers/usercontroller/usercontroller");
var router = express.Router();
const controllers=require('../controllers/usercontroller/usercontroller')
const userProductController=require('../controllers/usercontroller/userProductControllers')
const auths=require('../middlewares/middleware')

/* GET home page. */
router.get("/",auths.userauth,auths.userBlock,controllers.getHome)

router.get("/login",auths.userauth, auths.userBlock,controllers.getUserLogin)

router.post("/login", controllers.postUserLogin )

router.get("/signup",controllers.getSignUp)

router.post("/signup", controllers.postSignUp)

router.get("/shop",auths.userauth,auths.userBlock,userProductController.shopProduct)

router.get("/logout",controllers.getLogout);

router.get("/otplogin",auths.userBlock,controllers.getOtp)

router.post("/otplogin",controllers.postOtp)

router.get('/otpverify', controllers.getVerify)

router.post('/otpverify', controllers.postVerify)

router.get("/image/:id",auths.userauth,auths.userBlock,userProductController.imageZoom)

router.get("/add-to-cart/:id",auths.userauth,auths.userBlock,controllers.addToCart)

router.get("/cart",auths.userauth,auths.userBlock,controllers.listCart)

router.get("/check_out",auths.userauth,auths.userBlock,userProductController.checkOutPage)

router.post("/check_out",auths.userauth,userProductController.postcheckOutPage)

router.get("/add_address",auths.userauth,auths.userBlock,userProductController.getAddresspage)

router.post('/add_address',auths.userauth,userProductController.postAddresspage)

router.put('/change_product_quantity', auths.userauth,userProductController.postchangeProductQuantity)

router.delete('/delete_cart_item',auths.userauth,userProductController.getDeleteCart)

router.get('/order',auths.userauth,auths.userBlock,userProductController.getOrderPage)

router.post('/verify_payment',auths.userauth,userProductController.postVerifyPayment)

router.put('/cancel_order',auths.userauth,userProductController.putCancelOrder)

router.put('/return_order',auths.userauth,userProductController.putReturnOrder)

router.post('/search',auths.userauth,auths.userBlock,userProductController.getSearch)

router.post('/sort',auths.userauth,userProductController.postSort)

router.get('/order_details',auths.userauth,auths.userBlock,userProductController.orderDetails)

router.get('/order_success',auths.userauth,auths.userBlock,userProductController.orderSucess)

router.get('/sub_category',auths.userauth,auths.userBlock,userProductController.subCategory)

router.get('/sub_products',auths.userauth,auths.userBlock,userProductController.subProduct)

router.get('/add_to_wishlist',auths.userauth,auths.userBlock,userProductController.wishList)

router.get('/wishlist',auths.userauth,auths.userBlock,userProductController.ListWishList)

router.delete('/delete_wishlist',auths.userauth,auths.userBlock,userProductController.deleteWishList)











module.exports = router;
