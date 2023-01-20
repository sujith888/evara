const user =require("../../models/connection");
const multer= require('multer');
const { response } = require("../../app");
const ObjectId = require('mongodb').ObjectId




module.exports = {
   


    //get add product

    getAddProduct:()=>{
        return new Promise(async(resolve, reject) => {
            await user.category.find().exec().then((response)=>{
               
         resolve(response)
            })
        })
    },

    //post add product

    postAddProduct:(userdata,filename)=>{
        return new Promise((resolve, reject) => {
            
            
         

            ImageUpload= new user.product({
                Productname:userdata.name,
                ProductDescription:userdata.description,
                Quantity:userdata.quantity,
                  Image: filename,
                  SubCategory:userdata.subcategory,
                category:userdata.category,
                Price:userdata.price
            


               })
               ImageUpload.save().then((data)=>{
              
                resolve(data)
             
               })
        })
        

    },
    //get view product

    getViewProduct:()=>{
        
        return new Promise(async(resolve, reject) => {
           await user.product.find().exec().then((response)=>{
            
            resolve(response)
       
           })
        })
    },
    //delete view product

    deleteViewProduct:(productId)=>{
        return new Promise(async(resolve, reject) => {
            await user.product.deleteOne({_id:productId}).then((response)=>{
                resolve(response)
            })
        })
    },
    //edit product

    editProduct:(productId)=>{
        return new Promise(async(resolve, reject) => {
             await user.product.findOne({_id:productId}).exec().then((response)=>{
              console.log(response);
                resolve(response)

               
             })
        })
    },
    //post editproduct

    postEditProduct:(productId,editedData,image)=>{
        console.log(image);
        return new Promise(async(resolve, reject) => {

           await user.product.updateOne({_id:productId},{$set:{
            Productname:editedData.name,
            ProductDescription:editedData.description,
            Quantity:editedData.quantity,
            Price:editedData.price,
            category:editedData.category,
            SubCategory:editedData.subcategory,
            // Image:image
           }}) .then((response)=>{
     
            resolve(response)
           }) 
        })
    },
     //  imported from view category
  
     viewAddCategory:()=>{
        return new Promise(async(resolve, reject) => {
             await user.category.find().exec().then((response)=>{
                
                 resolve(response)
              
             })
         })
     },

     //view users order list

     orderPage: () => {
        return new Promise(async (resolve, reject) => {
    
          await user.order.aggregate([ 
          {
            $unwind: '$orders'
          },
          {
            $sort: { 'orders: createdAt': -1 }
          }
          ]).then((response) => {
            console.log(response);
           resolve(response)
          
          })
        })
    
      },
    
// view order users order details



orderDetails:(orderId)=>{
    return new Promise(async(resolve, reject) => {
        
    let order=    await user.order.findOne({'orders._id':orderId},{'orders.$':1})
    console.log(order+'----------------------------------------------------------------');
    resolve(order)
    })

},

// change order status

changeOrderStatus:(orderId,data)=>{
console.log(orderId);
  return new Promise(async(resolve, reject) => {
  let orders = await user.order.findOne({'orders._id':orderId},{'orders.$':1})
  console.log(orders);

  let users = await user.order.updateOne(
    {'orders._id': orderId}, 
    {
      $set: {
        'orders.$.OrderStatus': data.status,
     
      }
    }
  )
    resolve(response)
  })

},
//  find subcategory
findSubcategory:(categoryname)=>{

  return new Promise(async(resolve, reject) => {
   let result= await user.category.findOne({categoryName:categoryname }).then((response)=>{
    resolve(response)
   })
  
   resolve(result)
    
  })
 },


 OrderPage:(userId)=>{
  console.log(userId);
  return new Promise(async(resolve, reject) => {
    
  await user.order.find({userid:userId}).then((response)=>{
    
    resolve(response)
  })
 
  })
 },

}



