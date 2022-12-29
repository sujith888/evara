const user = require("../../models/connection");
const bcrypt=require('bcrypt');
const { response } = require("../../app");
 const ObjectId=require('mongodb').ObjectId

module.exports = {
  //sign up
  doSignUp: (userData) => {
     let response={};
    return new Promise(async(resolve,reject)=>{
      
  try{
    email=userData.email;
    existingUser =await user.user.findOne({email})
    if(existingUser)
    {
        response={status:false}
    return resolve(response)

    }
    else{
        var hashedPassword=await bcrypt.hash(userData.password,10);
        const data=new user.user({
           
              username: userData.username,
               Password: hashedPassword,
               email: userData.email,
               phonenumber: userData.phonenumber,
             })
       
        await data.save(data).then((data)=>{
          resolve({data,status:true})
        })
      }
    }
   
  catch(err){
     console.log(err);
  }

    
})
  
  

  },

  //login


  doLogin: (userData) => {

    return new Promise(async (resolve, reject) => {
        try {
            let response = {}
            let users = await user.user.findOne({ email: userData.email })
            if (users) {
              if(users.blocked==false){
                await bcrypt.compare(userData.password, users.Password).then((status) => {
                    if (status) {
                     userName=users.username
                     id=users._id
                        // response.status
                        resolve({response,loggedinstatus:true,userName,id})
                        console.log(userName);
                    } else {
                        resolve({ loggedinstatus: false })
                    }
                })
              }
              else{
                resolve({blockedStatus:true})
              }

              
            } else {
                resolve({loggedinstatus:false })
            }
        } catch (err) {
            console.log(err);
        }
    })


},
 
// add to cart

addToCartItem:(productId,userId)=>{
return new Promise((resolve, reject) => {
  

let users=user.user.findOne({_id:ObjectId(userId)})

if(users){
    console.log(users);
   user.cart.updateOne({user:ObjectId(userId)},
  {$push:
     {
      Product:ObjectId(productId),
     user:ObjectId(userId),
     }
  })

}else{
  
 let cartItem=user.cart({
    Product:ObjectId(productId),
    user:ObjectId(userId)
  })

cartItem.save(data).then((response)=>{
  console.log(response.cartItem);
resolve()



})
}
}) 

}
  
  
}
