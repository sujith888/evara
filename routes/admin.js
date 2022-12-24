var express = require("express");
const { getMaxListeners } = require("../app");
const adminController=require('../controllers/admincontroller')
const adminHelper=require('../helpers/adminHelpers')
var router = express.Router();
const user = require("../models/connection");

router.get("/", adminController.getDashboard)

router.get("/login",adminController.getAdminLogin);

router.post("/login",adminController.postAdminLogin)

router.get("/logout",adminController.getAdminLogOut)
 
router.get("/view_users",adminController.getViewUser)

router.get("/block_users/:id", function (req, res) {

  adminHelper.blockUser(req.params.id).then((response)=>{

    res.redirect('/admin/view_users')
  })
});
router.get("/unblock_users/:id", function (req, res) {

  adminHelper.UnblockUser(req.params.id).then((response)=>{

    res.redirect('/admin/view_users')
  })
});
router.get("/add_category",adminController.getCategory)

router.post("/add_category",adminController.postCategory)

router.get("/add_product", function (req, res) {
  res.render("admin/add-product", { layout: "adminLayout" });
});
router.post("/add_product", function (req, res) {
  
  res.render("admin/add-product", { layout: "adminLayout" });
});


router.get("/add_sub", function (req, res) {
  res.render("admin/add-subcategory", { layout: "adminLayout" });
});

module.exports = router;
