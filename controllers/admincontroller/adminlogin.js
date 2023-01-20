const { response } = require('../../app');
const adminHelper= require('../../helpers/adminHelpers/adminProductHelpers');
const adminUserhelper = require('../../helpers/adminHelpers/adminUserhelpers');
const { category } = require('../../models/connection');
const user = require("../../models/connection");
const adminLoginHelper=require('../../helpers/adminHelpers/adminLoginhelpers');
const adminLoginhelpers = require('../../helpers/adminHelpers/adminLoginhelpers');




  
module.exports={

 // get login

     getAdminLogin:(req, res)=> {
      let admins=req.session.admin
        if(req.session.adminloggedIn){
          res.render("admin/admin-dashboard",{layout:"adminLayout",admins})
        }else{
       
      res.render('admin/login',{layout:'adminLayout'})
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
            console.log('hlo');
            res.redirect('/admin')
          }else{
      res.render('admin/login',{layout:'adminLayout'})
          }
           

          })
        
        // }
       },
       
//get dashboard

  getDashboard: (req, res) =>{
    
   let adminstatus=req.session.adminloggedIn
   if(adminstatus){
  let admins=req.session.admin
    console.log(req.session.admin);
    
    res.render("admin/admin-dashboard",{ layout: "adminLayout" ,admins});
    }

  },

//admin logout

getAdminLogOut:(req,res)=>{
  req.session.adminloggedIn=false

  res.render("admin/login",{layout: "adminLayout"})
},

// get sign in 


getsignin:(req,res)=>{

  res.render('admin/admin-signup',{layout: "adminLayout"})
},


// post sign in 


postsignin:(req,res)=>{
     console.log(req.body);
  adminLoginHelper.postsignin(req.body).then((response)=>{

  console.log(response);
  })
  // res.render('admin/admin-signup',{layout: "adminLayout"})
},

 // list admins get admins

 getViewAdmins:(req,res)=>{

   adminLoginHelper.viewAdmins().then((response)=>{

       let admins=response
       console.log(admins);
       res.render('admin/view-admins',{layout: "adminLayout",admins})

   })

 }
 ,

 blockAdmin:(req,res)=>{
  console.log(req.query.adminid);
  adminLoginHelper.blockAdmin(req.query.adminId).then((response)=>{
    console.log(response.blocked+"=================================");
    res.json(response)

  })

 },


 unBlockAdmin:(req,res)=>{

adminLoginHelper.unBlockAdmin(req.query.adminId).then((response)=>{
      
   res.json(response)

 })
 },



}






