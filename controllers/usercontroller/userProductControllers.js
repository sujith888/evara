
const userproductHelpers = require('../../helpers/UserHelpers/userProduct')
const userhelpers = require('../../helpers/UserHelpers/UserHelpers')
const adminproductHelpers=require('../admincontroller/adminCategory')

const session = require('../usercontroller/usercontroller')
const { user } = require('../../models/connection')


module.exports = {


  //shop

  shopProduct: async (req, res) => {

    let users = req.session.user
    console.log(req.query)
    let pageNum=req.query.page 
    let perPage=6
    let count = await userhelpers.getCartCount(req.session.user.id)
   let documentCount=  await userproductHelpers.documentCount()
 
    let pages=Math.ceil((documentCount) /perPage)
    userproductHelpers.shopListProduct(pageNum,perPage).then((response) => {
      userproductHelpers.getCategory().then((Category)=>{
        console.log(Category);
        let category=Category
              res.render('user/shop', { response, count, users ,pages,category})
      })
    })

  },


  //image zoom



  imageZoom: (req, res) => {

    userproductHelpers.imageZoom(req.params.id).then((response) => {
      image = response
      console.log(image);

      res.render('user/imagezoom', { image })
    })
  },



  //get checkoutpage


  checkOutPage:async (req, res) => {
    
    let users = req.session.user.id
   
      let cartItems = await userhelpers.listAddToCart(req.session.user.id)
      let total = await userhelpers.totalCheckOutAmount(req.session.user.id)
      userproductHelpers.checkOutpage(req.session.user.id).then((response)=>{
      

        res.render('user/checkout',{users,cartItems,total,response})
  })

},



//post checkout

postcheckOutPage:async (req, res) => {
console.log('==========================================================================================');
   console.log(req.body );
  
 let total = await userhelpers.totalCheckOutAmount(req.session.user.id)
let order= await userproductHelpers.placeOrder(req.body, total).then((response) => {
          
        
         

   if (req.body['payment-method'] == 'COD') {
     res.json({ codstatus: true })

   } else {
     userproductHelpers.generateRazorpay(req.session.user.id, total).then((order) => {
       console.log(order.id);

       console.log(order.amount);
       res.json(order)

     })
   }
 })


},




//getaddresspage



  getAddresspage: async (req, res) => {

   
    console.log(req.session.user.id);
  


    res.render('user/add-address')

  },


  //post addresspage



  postAddresspage:  (req, res) => {
         
    
    userproductHelpers.postAddress(req.session.user.id,req.body).then((response)=>{

    
      res.redirect('/check_out')
    })

    

  },





//get orderpage



  getOrderPage: (req, res) => {
    userproductHelpers.orderPage(req.session.user.id).then((response) => {

      res.render('user/view-orderlist',{response})
    })

  },

  //post verifypayment



  postVerifyPayment: (req, res) => {
    console.log(req.body);
    userproductHelpers.verifyPayment(req.body).then(()=>{
      console.log(req.body);
     
      userproductHelpers.changePaymentStatus(req.session.user.id,req.body['order[receipt]']).then(()=>{

        res.json({status:true})

      }).catch((err)=>{
   console.log(err);
   res.json({status:false ,err})
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

 putCancelOrder:(req,res)=>{

     console.log(req.query.orderid);
  userproductHelpers.cancelOrder(req.query.orderid,req.session.user.id).then((response)=>{

    res.json({response})

  })
  
},
  getSearch:(req,res)=>{

    console.log(req.query.keyword);
    
    let keyword=req.query.keyword
   
  res.render('user/order-list')
//      userproductHelpers.productSearch(keyword).then((response)=>{

      
        
      
//      }).catch((err)=>{
// console.log(err);
    //  })
  },
  orderDetails:async(req,res)=>{
     
    let details=req.query.order
     
     userproductHelpers.viewOrderDetails(details).then((response)=>{   
       let products=response.products[0]
       let address=response.address
     let orderDetails=response.details
      


      res.render('user/order-list',{products,address,orderDetails})

     })
     
  },


  //order sucess

  
  orderSucess:(req,res)=>{

    
    res.render('user/order-sucess')
  },
  
  subCategory:async(req,res)=>{

    console.log(req.query.sub);
  let category= await  userproductHelpers.getCategory()
    userproductHelpers.subCategory(req.query.sub).then((Response)=>{

         console.log(Response.subcategories[0]);
         let response=Response.subcategories
         res.render('user/shop-new',{response,category})
    })

  },
  
  // display sub products 

  subProduct:async(req,res)=>{
    let category= await  userproductHelpers.getCategory()
   userproductHelpers.subProducts(req.query.subproductname).then((response)=>{
                    console.log(response+'sub');
                    
                    let sub=[response]
                   
        res.render('user/sub-products',{sub,category})
   }) 
  }


}