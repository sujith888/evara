
const userproductHelpers =require('../../helpers/UserHelpers/productHelpers')
const userhelpers = require('../../helpers/UserHelpers/UserHelpers')
const adminproductHelpers = require('../admincontroller/adminCategory')
const session = require('../usercontroller/usercontroller')
const user = require('../../models/connection')
const { response } = require('../../app')
const userProduct = require('../../helpers/UserHelpers/userProduct')

let wishCount,count, users ;
module.exports = {



  //shop

  shopProduct: async (req, res) => {

    let users = req.session.user
    console.log(req.query)
    let pageNum = req.query.page
    let perPage = 6
 
    documentCount = await userproductHelpers.productCount()

    count = await userhelpers.getCartCount(req.session.user.id)
     let wishCount=await userproductHelpers.getWishCount()
     
    let pages = Math.ceil((documentCount) / perPage)
    userproductHelpers.shopListProduct(pageNum, perPage).then((response) => {
      userproductHelpers.getCategory().then((Category) => {
        let category = Category
        console.log(pages);
        res.render('user/shop', { response, count, users, pages, category ,wishCount})
      })
    })

  },

  //image zoom



  imageZoom: (req, res) => {
    console.log(count );

    userproductHelpers.imageZoom(req.params.id).then((response) => {
    let   image = response
    console.log(image);
      res.render('user/productimagezoom', { image,wishCount,count ,users})
    })
  },



  //get checkoutpage


  checkOutPage: async (req, res) => {

  let users=req.session.user.id
    let cartItems = await userhelpers.listAddToCart(req.session.user.id)
    let total = await userhelpers.totalCheckOutAmount(req.session.user.id)
    userproductHelpers.checkOutpage(req.session.user.id).then((response) => {


      res.render('user/checkout', { users, cartItems, total, response,wishCount,count })
    })

  },



  //post checkout

  postcheckOutPage: async (req, res) => {
    console.log('==========================================================================================');
    console.log(req.body);

    let total = await userhelpers.totalCheckOutAmount(req.session.user.id)
    let order = await userproductHelpers.placeOrder(req.body, total).then((response) => {




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
    res.render('user/add-address',{users,wishCount,count})

  },



  //post addresspage



  postAddresspage: (req, res) => {


    userproductHelpers.postAddress(req.session.user.id, req.body).then((response) => {


      res.redirect('/check_out')
    })



  },





  //get orderpage



  getOrderPage: async(req, res) => {
    let users=req.session.user
    let wishCount=await userproductHelpers.getWishCount()
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

      res.render('user/view-orderlist', { response ,getDate,users,wishCount,count})
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
   console.log(req.query.orderid+"++++++++++++++");
    userproductHelpers.returnOrder(req.query.orderid,req.session.user.id).then((response) => {
        res.json(response);
      });
  },
  getSearch: async(req, res) => {

    let category=await  userproductHelpers.getCategory()
    // console.log(req.query.page);
    // let pageNum = req.query.page
    // let perPage = 6
 
    // documentCount = await userproductHelpers.productCount()


    // let pages = Math.ceil((documentCount) / perPage)

    userproductHelpers.productSearch(req.body).then((response)=>{
          res.render('user/shop-new',{response,category})
          console.log(response);
         }).catch((err)=>{
    console.log(err);
    res.render('user/shop-new',{err,category})

         })
  },


  //  post sort

  postSort:async (req, res) => {
  let users=req.session.user
  let wishCount= await userproductHelpers.getWishCount()
  console.log(wishCount);

  let count= await userhelpers.getCartCount()
  console.log(count);

    console.log(req.body);
    let sortOption = req.body['selectedValue'];
   let category=await  userproductHelpers.getCategory()
    userproductHelpers.postSort(sortOption).then((response) => {
    res.render('user/shop-new',{response,category,users,wishCount,count})
    })
  },

  orderDetails: async (req, res) => {

    let details = req.query.order

    const getDate = (date) => {
      let orderDate = new Date(date);
      let day = orderDate.getDate();
      let month = orderDate.getMonth() + 1;
      let year = orderDate.getFullYear();
      return `${isNaN(day) ? "00" : day}-${isNaN(month) ? "00" : month}-${isNaN(year) ? "0000" : year
        }`;
    };

    userproductHelpers.viewOrderDetails(details).then( (response) => {

      let products = response.products[0]
      let address = response.address
      let orderDetails = response.details

      let data =  userproductHelpers.createData(response,getDate)


      res.render('user/order-list', { products, address, orderDetails,data,getDate,users,wishCount,count})

    })

  },


  //order sucess


  orderSucess: (req, res) => {


    res.render('user/order-sucess',{users,wishCount,count})
  },

  subCategory: async (req, res) => {

    console.log(req.query.sub);
    let category = await userproductHelpers.getCategory()
    userproductHelpers.subCategory(req.query.sub).then((response) => {
      console.log(response + 'shop helpers');
      res.render('user/shop-new', { response, category ,users,count,wishCount})
    })

  },

  // display sub products 

  subProduct: async (req, res) => {
    let category = await userproductHelpers.getCategory()
    userproductHelpers.subProducts(req.query.subproductname).then((response) => {
      console.log(response + 'sub');

      let sub = [response]

      res.render('user/sub-products', { sub, category,users,wishCount,count })
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
     wishCount = await userproductHelpers.getWishCount(req.session.user.id)
    userproductHelpers.ListWishList(req.session.user.id).then((wishlistItems) => {
      console.log(wishCount);
      res.render('user/wishlist', { wishlistItems, wishCount, users,count })

    })
  },

  deleteWishList: (req, res) => {
    userproductHelpers.deleteWishList(req.body).then((response) => {

      res.json(response)

    })
  },

}