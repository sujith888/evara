const adminHelper= require('../helpers/adminHelpers')
const user = require("../models/connection");


const adminCredential={
    name:'superAdmin',
    email:'admin@gmail.com',
    password:'admin123'
   }
   let adminStatus
module.exports={


     getAdminLogin:(req, res)=> {
        if(req.session.adminloggedIn){
          res.render("admin/admin-dashboard",{layout:"adminLayout",adminStatus})
        }
        else{
          res.render("admin/login", { layout: "adminLayout", adminStatus});

        }
      },


      postAdminLogin:(req, res)=> {
     

       
        // console.log(req.body);
        if(req.body.email==adminCredential.email && req.body.password==adminCredential.password){
          req.session.admin=adminCredential,
         req.session.adminloggedIn=true
         
         adminStatus=req.session.adminloggedIn
         
        res.redirect('/admin')
      }
      
        else{
          adminloginErr=true
        
        res.redirect('/admin/login')
        }
       },
       

  getDashboard: (req, res) =>{
    let variable=req.session.admin
    if(adminStatus){
    
    res.render("admin/admin-dashboard", { layout: "adminLayout" ,variable,adminStatus});
    }else{
      res.redirect('/admin/login')
    }

  
},
  getViewUser: (req, res)=>{
    adminHelper.getUsers().then((user)=>{
      res.render("admin/view-users", { layout: "adminLayout",user,adminStatus});
  
    })
},
getAdminLogOut:(req,res)=>{
  req.session.admin=null
  adminStatus=false
  res.render("admin/login",{layout: "adminLayout",adminStatus})
},

 getCategory:(req, res)=>{

  res.render("admin/add-category", { layout: "adminLayout",adminStatus });
},
postCategory:(req, res)=>{
  console.log(req.body)
  adminHelper.addCategory(req.body)
  
    res.redirect('/admin/add_category')
  
},

}