
const { response } = require("../../app.js");
const { shopProduct } = require("../../controllers/usercontroller/userProductControllers.js");
const user = require("../../models/connection");


 //display shop
 
 module.exports={
 shopListProduct:()=>{
    return new Promise(async(resolve, reject) => {
      await user.product.find().exec().then((response)=>{
        resolve(response)
      })
    })
  },

  //image zoom


  imageZoom:(requestedId)=>{
    return new Promise(async(resolve, reject) => {
      await user.product.findOne({_id:requestedId}).then((response)=>{
        resolve(response)
      })
    })
  },

  
}