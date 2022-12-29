var express = require("express");
var router = express.Router();
const controllers=require('../controllers/usercontroller/usercontroller')
const userProductController=require('../controllers/usercontroller/userProductControllers')
const auths=require('../middlewares/middleware')

/* GET home page. */
router.get("/",controllers.getHome)

router.get("/login",controllers.getUserLogin)

router.post("/login", controllers.postUserLogin )

router.get("/signup",controllers.getSignUp)

router.post("/signup", controllers.postSignUp)

router.get("/shop",auths.userauth,userProductController.shopProduct)

router.get("/logout",auths.userauth,controllers.getLogout);

router.get("/otplogin",controllers.getOtp)

router.post("/otplogin",controllers.postOtp)

router.get('/otpverify', controllers.getVerify)

router.post('/otpverify', controllers.postVerify)

router.get("/image/:id",userProductController.imageZoom)

router.get("/add-to-cart/:id",auths.userauth,controllers.addToCart)

module.exports = router;
