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
      let response = category;
      console.log(response + 'i am response');
      let products = response[0].subcategories;
      console.log(products + 'i am products');

      res.render("admin/add-product", { layout: "adminLayout", response, admins, products });
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
      let procategory = response
      let category = procategory[0]

      adminProductHelpers.editProduct(req.query.edit).then((response) => {
        let editproduct = response
        res.render('admin/edit-viewproduct', { layout: "adminLayout", editproduct, procategory, admins });

      })
    })



  },

  //posteditaddproduct


  postEditAddProduct: (req, res) => {
    const images = [];
    if (req.files) {
      Object.keys(req?.files).forEach((key) => {
        if (Array.isArray(req.files[key])) {
          req.files[key].forEach((file) => {
            images.push(file.filename);
          });
        } else {
          images.push(req.files[key].filename);
        }
      });
    }
    adminProductHelpers.postEditProduct(req.query.edit, req.body, images)
      .then(() => {
        res.redirect('/admin/view_product');
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Internal server error');
      });
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
    let admins=req.session.admin

      res.render('admin/order-List', { layout: 'adminLayout', response, getDate ,admins})
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
      let admins=req.session.admin
      let products = order.orders[0].productDetails
      let total = order.orders
      res.render('admin/order-details', { layout: 'adminLayout', order, products, total, getDate,admins })
    })

  },

  // change user payments status

  postOrderDetails: (req, res) => {
    adminProductHelpers.changeOrderStatus(req.query.orderId, req.body).then((response) => {
      res.redirect('/admin/orders_list')
    })

  },

  findSubcategory: (req, res) => {

    console.log(req.query.categoryName);
    adminProductHelpers.findSubcategory(req.query.categoryName).then((response) => {
      console.log("_______________________________________________________");
      console.log(response);
      let subcategories = response.subcategories
      res.json(subcategories)

    })
  },


  //view users


  orderPage: (req, res) => {
    let admins=req.session.admin
   
    adminProductHelpers.OrderPage(req.query.userid).then((Response) => {
  let response=Response[0].orders
  console.log(response);
      res.render('admin/adminorder-list',{ layout: 'adminLayout', response ,admins})
      
     
    })

  },

  adminOrderDetails: (req, res) => {

    adminProductHelpers.orderDetails(req.query.order).then((order) => {
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
      let admins=req.session.admin
      let products = order.orders[0].productDetails
      let total = order.orders
      res.render('admin/order-details', { layout: 'adminLayout', order, products, total, getDate,admins })
    })
   
  },

  getAddBanner: (req, res) => {

    res.render('admin/add-banner', { layout: 'adminLayout' })
  },
  postAddBanner: (req, res) => {

    adminProductHelpers.addBanner(req.body, req.file.filename).then((response) => {

      res.redirect('/admin/add_banner')

    })
  },

  //edit banner

  listBanner: (req, res) => {

    adminProductHelpers.listBanner().then((response) => {

      let admins=req.session.admin

      res.render('admin/list-banner', { layout: 'adminLayout', response ,admins})

    })

  },

  //edit banner


  getEditBanner: (req, res) => {

    adminProductHelpers.editBanner(req.query.banner).then((response) => {
     
      res.render('admin/edit-banner', { layout: 'adminLayout', response })

    })

  },

  // post edit banner 


  postEditBanner: (req, res) => {

    adminProductHelpers.postEditBanner(req.query.editbanner, req.body,req.file.filename).then((response) => {
 res.redirect('/admin/list_banner')

    })
  }


}
