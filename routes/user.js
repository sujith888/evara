var express = require("express");
var router = express.Router();
const controllers=require('../controllers/usercontroller')

/* GET home page. */
router.get("/",controllers.getHome)
  
router.get("/login", controllers.getUserLogin)

router.post("/login", controllers.postUserLogin )

router.get("/signup",controllers.getSignUp)

router.post("/signup", controllers.postSignUp)

router.get("/shop", function (req, res, next) {
  res.render("user/shop");
});
router.get("/logout",controllers.getLogout);
  
module.exports = router;
