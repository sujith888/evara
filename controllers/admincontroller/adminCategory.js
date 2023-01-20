const { response } = require('../../app');
const adminCategoryHelper= require('../../helpers/adminHelpers/adminCategoryHelper');
const { category } = require('../../models/connection');
const user = require("../../models/connection");




module.exports={
    
//get method category
getCategory:(req, res)=>{
    let admins=req.session.admin
    adminCategoryHelper.viewAddCategory().then((response)=>{
     var viewCategory=response
     let sub=response[0].subcategories
     console.log(response[0].subcategories);
      res.render("admin/add-category", { layout: "adminLayout" ,viewCategory,admins,sub});
    })
    
  },
  //post method category
  
  postCategory:(req, res)=>{
        console.log(req?.body);
      adminCategoryHelper.addCategory(req?.body).then((data)=>{
       
        res.redirect('/admin/add_category')
    })
     
  },
  //deletecategory
  
  deleteCategory:(req,res)=>{
      
    adminCategoryHelper.deleteCatogory(req.params.id).then((response)=>{
      res.redirect('/admin/add_category')
    })
  },
  //getedit category
  
  editCategory:(req,res)=>{
    let admins=req.session.admin
     adminCategoryHelper.editCategory(req.query.edited).then((response)=>{
      
      
      res.render('admin/edit_category',{layout:"adminLayout",response,admins})
     })
  },
  //postedit category
  
  postEditCategory:(req,res)=>{
    
     adminCategoryHelper.postEditCategory(req.query.edited,req.body.editCategoryname).then((response)=>{
  
      res.redirect('/admin/add_category')
     })
    
  },
  
}