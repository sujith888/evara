
const userproductHelpers = require('../../helpers/UserHelpers/productHelpers')
const adminproductHelpers = require('../admincontroller/adminCategory')
const session = require('../usercontroller/usercontroller')
const user = require('../../models/connection')
const { response } = require('../../app')
const userProduct = require('../../helpers/UserHelpers/userProduct')
const couponHelpers = require('../../helpers/adminHelpers/couponHelpers')
const userhelpers = require('../../helpers/UserHelpers/UserHelpers')
const profileHelper = require('../../helpers/UserHelpers/profileHelper')

let couponTotal, couponName, discountAmount;
let wishCount, count, users;
module.exports = {



  //shop

  shopProduct: async (req, res) => {

    let users = req.session.user
    console.log(req.query)
    let pageNum = req.query.page
    let perPage = 6

    documentCount = await userproductHelpers.productCount()

    count = await userhelpers.getCartCount(req.session.user.id)
    let wishCount = await userproductHelpers.getWishCount()

    let pages = Math.ceil((documentCount) / perPage)
    userproductHelpers.shopListProduct(pageNum, perPage).then((response) => {
      userproductHelpers.getCategory().then((Category) => {
        let category = Category
        console.log(pages);
        res.render('user/shop', { response, count, users, pages, category, wishCount })
      })
    })

  },

  //image zoom



  imageZoom: async (req, res) => {
    let users = req.session.user
    let count = await userhelpers.getCartCount(req.session.user.id)
    let wishCount = await userproductHelpers.getWishCount()
    userproductHelpers.imageZoom(req.params.id).then((response) => {
      let data = response
      res.render('user/image-zoom', { data, wishCount, count, users })
    })
  },



  //get checkoutpage


  checkOutPage: async (req, res) => {
    console.log(req.body)
    let total;
    console.log("_________________________________________________");;
    let users = req.session.user.id
    let cartItems = await userhelpers.listAddToCart(req.session.user.id)
    let DiscountAmount
    if (couponName) {
      total = couponTotal
      DiscountAmount = "-" + discountAmount
    } else {
      total = await userhelpers.totalCheckOutAmount(req.session.user.id)


      DiscountAmount = 0;
    }


    userproductHelpers.checkOutpage(req.session.user.id).then((response) => {


      res.render('user/checkout', { users, cartItems, total, response, wishCount, count, DiscountAmount })
    })

  },



  //post checkout

  postcheckOutPage: async (req, res) => {
    let DiscountAmount;
    let grandtotal = await userhelpers.totalCheckOutAmount(req.session.user.id)
    if (couponName) {
      total = couponTotal

      DiscountAmount = discountAmount
    } else {
      total = await userhelpers.totalCheckOutAmount(req.session.user.id)

      DiscountAmount = 0;
    }
    let order = await userproductHelpers.placeOrder(req.body, total, DiscountAmount, grandtotal).then((response) => {




      if (req.body['payment-method'] == 'COD') {
        
        res.json({ codstatus: true })

      } else {
        try {
          userproductHelpers.generateRazorpay(req.session.user.id, total).then((order) => {
            console.log(order);
            res.json(order);
          });
        } catch (error) {
          console.log(error);
          res.status(500).send(error);
        }
      }
    })
  },



  //getaddresspage



  getAddresspage: async (req, res) => {

    console.log(req.session.user.id);
    res.render('user/add-address', { users, wishCount, count })

  },



  //post addresspage



  postAddresspage: (req, res) => {


    userproductHelpers.postAddress(req.session.user.id, req.body).then((response) => {


      res.redirect('/check_out')
    })



  },





  //get orderpage



  getOrderPage: async (req, res) => {
    let users = req.session.user
    let wishCount = await userproductHelpers.getWishCount()
    let count = await userhelpers.getCartCount()
    userproductHelpers.orderPage(req.session.user.id).then((response) => {
      const getDate = (date) => {
        let orderDate = new Date(date);
        let day = orderDate.getDate();
        let month = orderDate.getMonth() + 1;
        let year = orderDate.getFullYear();
        return `${isNaN(day) ? "00" : day}-${isNaN(month) ? "00" : month}-${isNaN(year) ? "0000" : year
          }`;
      };

      res.render('user/view-orderlist', { response, getDate, users, wishCount, count })
    })

  },

  //post verifypayment



  postVerifyPayment: (req, res) => {
    console.log(req.body);
    userproductHelpers.verifyPayment(req.body).then(() => {
      console.log(req.body);

      userproductHelpers.changePaymentStatus(req.session.user.id, req.body['order[receipt]']).then(() => {
        res.json({ status: true })
        console.log("hiiii");

      }).catch((err) => {
        res.json({ status: false, err })
      })

    })


  },

  //postchange productquantiity


  postchangeProductQuantity: async (req, res) => {
    await userproductHelpers.changeProductQuantity(req.body).then(async (response) => {

      response.total = await userhelpers.totalCheckOutAmount(req.body.user)

      res.json(response)


    })


  },


  //get deletecart



  getDeleteCart: (req, res) => {
    console.log(req.body);
    userproductHelpers.deleteCart(req.body).then((response) => {
      res.json(response)
    })
  },


  // cancelorder

  putCancelOrder: (req, res) => {

    console.log(req.query.orderid);
    userproductHelpers.cancelOrder(req.query.orderid, req.session.user.id).then((response) => {

      res.json({ response })

    })

  },

  // RETURN ORDER


  putReturnOrder: (req, res) => {
    console.log(req.query.orderid + "++++++++++++++");
    userproductHelpers.returnOrder(req.query.orderid, req.session.user.id).then((response) => {
      res.json(response);
    });
  },
  getSearch: async (req, res) => {

    let category = await userproductHelpers.getCategory()
    // console.log(req.query.page);
    // let pageNum = req.query.page
    // let perPage = 6

    // documentCount = await userproductHelpers.productCount()


    // let pages = Math.ceil((documentCount) / perPage)
    let wishCount = await userproductHelpers.getWishCount()
    let count = await userhelpers.getCartCount()

    userproductHelpers.productSearch(req.body).then((response) => {
      let users = req.session.user
      res.render('user/shop-new', { response, category, users, wishCount, count })
      console.log(response);
    }).catch((err) => {
      console.log(err);
      res.render('user/shop-new', { err, category })

    })
  },


  //  post sort

  postSort: async (req, res) => {
    let users = req.session.user
    let wishCount = await userproductHelpers.getWishCount()
    console.log(wishCount);

    let count = await userhelpers.getCartCount()
    console.log(count);

    console.log(req.body);
    let sortOption = req.body['selectedValue'];
    let category = await userproductHelpers.getCategory()
    userproductHelpers.postSort(sortOption).then((response) => {
      res.render('user/shop-new', { response, category, users, wishCount, count })
    })
  },

  orderDetails: async (req, res) => {

    let details = req.query.order
    console.log(req.session.user.id);

    const getDate = (date) => {
      let orderDate = new Date(date);
      let day = orderDate.getDate();
      let month = orderDate.getMonth() + 1;
      let year = orderDate.getFullYear();
      return `${isNaN(day) ? "00" : day}-${isNaN(month) ? "00" : month}-${isNaN(year) ? "0000" : year
        }`;
    };

    userproductHelpers.viewOrderDetails(details).then(async (response) => {
      let grandTotal = await userproductHelpers.totalAmount(req.session.user.id)

      let products = response.products[0]
      let address = response.address
      let orderDetails = response.details
      let data = await userproductHelpers.createData(response, getDate)
      res.render('user/order-list', { products, address, orderDetails, data, getDate, users, wishCount, count, grandTotal })

    })

  },


  //order sucess


  orderSucess: (req, res) => {


    res.render('user/order-sucess', { users, wishCount, count })
  },

  subCategory: async (req, res) => {
    let users = req.session.user
    let wishCount = await userproductHelpers.getWishCount()
    let count = await userhelpers.getCartCount()
    let category = await userproductHelpers.getCategory()
    userproductHelpers.subCategory(req.query.sub).then((response) => {
      res.render('user/shop-new', { response, category, users, count, wishCount })
    })

  },

  // display sub products 

  subProduct: async (req, res) => {
    let category = await userproductHelpers.getCategory()
    userproductHelpers.subProducts(req.query.subproductname).then((response) => {
      console.log(response + 'sub');

      let sub = [response]

      res.render('user/sub-products', { sub, category, users, wishCount, count })
    })
  },


  // wishlist

  wishList: (req, res) => {


    userproductHelpers.AddTowishList(req.query.wishid, req.session.user.id).then((response) => {
      res.json(response.status)

    })

  },

  ListWishList: async (req, res) => {
    let users = req.session.user
    let count = await userhelpers.getCartCount()
    wishCount = await userproductHelpers.getWishCount(req.session.user.id)
    userproductHelpers.ListWishList(req.session.user.id).then((wishlistItems) => {
      console.log(wishCount);
      res.render('user/wishlist', { wishlistItems, wishCount, users, count })

    })
  },

  deleteWishList: (req, res) => {
    userproductHelpers.deleteWishList(req.body).then((response) => {

      res.json(response)

    })
  },

  validateCoupon: async (req, res) => {

    console.log(req.query.couponName);
    let code = req.query.couponName;
    let total = await userhelpers.totalCheckOutAmount(req.session.user.id)
    couponHelpers.couponValidator(code, req.session.user.id, total).then((response) => {
      console.log(response.status);
      res.json(response)
    })

  },

  postCart: async (req, res) => {

    let couponData = req.body
    console.log(req.body);
    couponName = req.body.couponName
    couponTotal = req.body.total
    discountAmount = req.body.discountAmount
    if (couponData.couponName) {
      await couponHelpers.addCouponIntUseroDb(couponData, req.session.user.id).then((response) => {
        res.redirect("/check_out")
      })
    } else {
      res.redirect('/check_out')
    }

  },
  resetPassword: (req, res) => {
    let user = req.session.user.id;
    console.log(user);
    res.render("user/reset-password", { users, user });
  },
  updatePassword: async (req, res) => {
    console.log(req.query.proId);
    let passResponse = await profileHelper.verifyPassword(
      req.body,
      req.query.proId
    );
    if (passResponse) {
      res.json(true);
    } else {
      res.json(false);
    }
  },

  getAddress: async (req, res) => {
    let response = await userproductHelpers.checkOutpage(req.session.user.id);

    res.render("user/address", { response, users });
  },
  deleteAddress: (req, res) => {
    userproductHelpers.deleteAddress(req.body).then((response) => {
      console.log(response);
      res.json(response);
    });
  },


  getProfileAddAddress: (req, res) => {

    res.render('user/add-address-profile', { users })
  },
  postProfileAddAddress: async (req, res) => {

    let response = await userproductHelpers.postAddress(req.session.user.id, req.body)

    res.redirect('/view_address')
  },

  getEditAddAddress: (req, res) => {

    userproductHelpers.editAddress(req.query.addressId).then((Response) => {
      let response = Response.Address[0]
      console.log(Response.Address);
      console.log(Response.Address[0]);
      console.log(Response.Address[0].fname);
      res.render('user/edit-address', { users, response })

    })
  },

  postEditAddress: (req, res) => {

    console.log(req.body);
    userproductHelpers.PostEditAddress(req.query.addressId, req.body)
  }
}