const user = require("../models/connection");
const bcrypt=require('bcrypt');
const { response } = require("../app");
module.exports = {
  doSignUp: (userData) => {
     let response={};
    return new Promise(async(resolve,reject)=>{
      
  try{
    email=userData.email;
    existingUser =await user.findOne({email})
    if(existingUser)
    {
        response={status:false}
    return resolve(response)

    }
    else{
        var hashedPassword=await bcrypt.hash(userData.password,10);
        const data=new user({
           
              username: userData.username,
               Password: hashedPassword,
               email: userData.email,
               phonenumber: userData.phonenumber,
             })
         console.log(data);
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
  doLogin: (userData) => {

    return new Promise(async (resolve, reject) => {
        try {
            let response = {}
            let users = await user.findOne({ email: userData.email })
            if (users) {
              if(users.blocked==false){
                await bcrypt.compare(userData.password, users.Password).then((status) => {
                    if (status) {
                        response.user = user
                        // response.status
                        resolve({response,status:true})
                    } else {
                        resolve({ blockedStatus:false,status: false })
                    }
                })
              }
              else{
                resolve({blockedStatus:true,status:false})
              }

              
            } else {
                resolve({blockedStatus:false, status: false })
            }
        } catch (err) {
            console.log(err);
        }
    })


},
 

  
};
