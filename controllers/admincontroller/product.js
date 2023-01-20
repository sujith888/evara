const { response } = require('../../app');
const adminProductHelpers = require('../../helpers/adminHelpers/adminProductHelpers');
const { category } = require('../../models/connection');
const user = require("../../models/connection");
const userProductControllers = require('../usercontroller/userProductControllers');


module.exports = {
  //get add product


  getAddProduct: (req, res) => {
    let admins = req.session.admin
    adminProductHelpers.getAddProduct().then((category) => {
   let response=   category;
   console.log(response + 'i am response');
   let products=response[0].subcategories;
   console.log(products + 'i am products');
  
      res.render("admin/add-product", { layout: "adminLayout", response, admins,products });
    })

  },
  //post add product


  postAddProduct: (req, res) => {
    console.log(req.files)

    let image = req.files.map(files => (files.filename))
    console.log(image);

    adminProductHelpers.postAddProduct(req.body, image).then(() => {
      res.redirect('/admin/view_product')
    })

  },

  //getview product


  getViewproduct: (req, res) => {
    let admins = req.session.admin
    adminProductHelpers.getViewProduct().then((response) => {
      res.render("admin/view-product", { layout: "adminLayout", response, admins });
    })

  },


  //edit view product

  editViewProduct: (req, res) => {
    let admins = req.session.admin
    adminProductHelpers.viewAddCategory().then((response) => {
                            console.log(response);
      let  procategory =response
     let category=procategory[0]
     console.log(category);
      adminProductHelpers.editProduct(req.query.edit).then((response) => {
      let  editproduct = response
      console.log(editproduct);

        res.render('admin/edit-viewproduct', { layout: "adminLayout", editproduct, procategory, admins });

      })
    })



  },

  //posteditaddproduct


  postEditAddProduct: (req, res) => {
    console.log(req.body + 'hloooooooo');
    let image = req?.files?.map(files => (files?.filename))
    console.log(image);
    console.log(req.query.edit);
    adminProductHelpers.postEditProduct(req.query.edit, req.body, image).then((response) => {

      res.redirect('/admin/view_product')
    })


  },


  //delete view product 


  deleteViewProduct: (req, res) => {

    adminProductHelpers.deleteViewProduct(req.query.delete).then((response) => {
      res.redirect('/admin/view_product')
    })

  },

  // get order list


  getOrderList: (req, res) => {


    adminProductHelpers.orderPage().then((response) => {
      const getDate = (date) => {
        let orderDate = new Date(date);
        let day = orderDate.getDate();
        let month = orderDate.getMonth() + 1;
        let year = orderDate.getFullYear();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        return `${isNaN(day) ? "00" : day}-${isNaN(month) ? "00" : month}-${isNaN(year) ? "0000" : year
          } ${date.getHours(hours)}:${date.getMinutes(minutes)}:${date.getSeconds(seconds)}`;
      };
      res.render('admin/order-List', { layout: 'adminLayout', response, getDate })
    })
  },


  // get order details


  getOrderDetails: (req, res) => {
    console.log(req.query.orderid);
    adminProductHelpers.orderDetails(req.query.orderid).then((order) => {
      const getDate = (date) => {
        let orderDate = new Date(date);
        let day = orderDate.getDate();
        let month = orderDate.getMonth() + 1;
        let year = orderDate.getFullYear();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        return `${isNaN(day) ? "00" : day}-${isNaN(month) ? "00" : month}-${isNaN(year) ? "0000" : year
          } ${date.getHours(hours)}:${date.getMinutes(minutes)}:${date.getSeconds(seconds)}`;
      };
       
      let products = order.orders[0].productDetails
      let total = order.orders
      res.render('admin/order-details', { layout: 'adminLayout', order, products, total, getDate })
    })

  },

  // change user payments status

  postOrderDetails:(req,res)=>{
    console.log(typeof req.query.orderId);
   console.log(req.body);
    console.log(req.body);
    adminProductHelpers.changeOrderStatus(req.query.orderId,req.body).then((response)=>{
             res.redirect('/admin/orders_list')
    })

  },
  
findSubcategory:(req,res)=>{

  console.log(req.query.categoryName);
  adminProductHelpers.findSubcategory(req.query.categoryName).then((response)=>{
    console.log("_______________________________________________________");
   console.log(response);
     let subcategories=response.subcategories
     res.json(subcategories)
 
  })
},


//view users


orderPage:(req,res)=>{

  adminProductHelpers.OrderPage(req.query.userid).then((Response)=>{
    let response=Response[0].orders
      res.render('admin/adminorder-list',{layout:'adminLayout',response})
  })
   
},

adminOrderDetails:(req,res)=>{


},

}
