const { response } = require('../../app');
const adminHelper= require('../../helpers/adminHelpers/adminProductHelpers');
const adminUserhelper = require('../../helpers/adminHelpers/adminUserhelpers');
const { category, product } = require('../../models/connection');
const user = require("../../models/connection");
const adminLoginHelper=require('../../helpers/adminHelpers/adminLoginhelpers');
const adminLoginhelpers = require('../../helpers/adminHelpers/adminLoginhelpers');




let admins;
  
module.exports={

 // get login

     getAdminLogin:(req, res)=> {
      admins=req.session.admin
        if(req.session.adminloggedIn){
  res.redirect('/admin')
        }else{
       
          res.redirect('/admin/login')
        }
        
      },


  postAdminLogin:(req, res)=> {
        
      //   if(req.body.email==adminCredential.email && req.body.password==adminCredential.password){
      //     console.log(req.body);
          
      //   req.session.adminloggedIn=true
        
      //   req.session.admin=adminCredential
       
      //   
      // }
      
      //   else{
      //     adminloginErr=true
          adminLoginhelpers.postlogin(req.body).then((response)=>{
            console.log(response);
            req.session.adminloggedIn=true
            req.session.admin=response
         let status=   response.loggedinstatus
         
          if(status==true){
            res.redirect('/admin')
          }else{
      res.render('admin/login',{layout:'adminLayout'})
          }
           

          })
        
        // }
       },
       
//get dashboard

  getDashboard:async (req, res) =>{
    
   if(req.session.adminloggedIn){
 let  admins=req.session.admin

  let totalProducts, days=[]
  let ordersPerDay = {};
 let paymentCount=[];

 let  Products= await adminHelper.getViewProduct()
  
    totalProducts = Products.length
 
   let orderByCod=  await adminHelper.getCodCount()
 
   let codCount=orderByCod.length

   let orderByOnline= await adminHelper.getOnlineCount()
   let totalUser= await adminHelper.totalUserCount()

   let totalUserCount=totalUser.length

   let onlineCount=orderByOnline.length;

  
   paymentCount.push(onlineCount)
   paymentCount.push(codCount)

 await adminHelper.getOrderByDate().then((response)=>
  {
    let result = response[0]?.orders
    for (let i = 0; i < result.length; i++) {
      let ans={}

      ans['createdAt']=result[i].createdAt
      days.push(ans)
   
     
      
    }
   


days.forEach((order) => {
  const day = order.createdAt.toLocaleDateString('en-US', { weekday: 'long' });
  ordersPerDay[day] = (ordersPerDay[day] || 0) + 1;


});

  })


  await adminHelper.getAllOrders().then((response)=>
  {

    var length = response.length
    
    let total = 0;
    
    for (let i = 0; i < length; i++) {
      total += response[i].orders.totalPrice;
    }
  

    res.render("admin/admin-dashboard",{ layout: "adminLayout" ,admins, length, total, totalProducts,ordersPerDay,paymentCount,totalUserCount});

  }) 
  
   }

  },

//admin logout

getAdminLogOut:(req,res)=>{
  if(req.session.adminloggedIn){
  req.session.adminloggedIn=false
 res.redirect('/admin/login')
  }
},

// get sign in 


getsignin:(req,res)=>{

  res.render('admin/admin-signup',{layout: "adminLayout"})
},


// post sign in 


postsignin:(req,res)=>{
  adminLoginHelper.postsignin(req.body).then((response)=>{

  console.log(response);
  })
  // res.render('admin/admin-signup',{layout: "adminLayout"})
},

 // list admins get admins

 getViewAdmins:(req,res)=>{

   adminLoginHelper.viewAdmins().then((response)=>{

       let admin=response
       res.render('admin/view-admins',{layout: "adminLayout",admin,admins})

   })

 }
 ,

 blockAdmin:(req,res)=>{
  adminLoginHelper.blockAdmin(req.query.adminId).then((response)=>{
    res.json(response)

  })

 },


 unBlockAdmin:(req,res)=>{

adminLoginHelper.unBlockAdmin(req.query.adminId).then((response)=>{
      
   res.json(response)

 })
 },



}






