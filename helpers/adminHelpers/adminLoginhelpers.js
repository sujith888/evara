

const user = require("../../models/connection");
const multer = require('multer');
const { response } = require("../../app");
const bcrypt = require('bcrypt');











module.exports = {

    // admin post sign in 


    postsignin: (data) => {
        return new Promise(async (resolve, reject) => {


            let hashedPassword = await bcrypt.hash(data.password, 10)

            const admindata = user.admin({
                name: data.name,
                password: hashedPassword,
                email: data.email,
                role: data.role

            })
            await admindata.save().then((response) => {
                console.log(response);
            })
        })
    },

    // post login h
    postlogin: (data) => {

        return new Promise(async (resolve, reject) => {
            try {

                let admin = await user.admin.findOne({ email: data.email })
                if (admin) {

                    await bcrypt.compare(data.password, admin.password).then((status) => {
                        if (status) {
                            Name = admin.name
                            id = admin._id
                            role = admin.role
                            // response.status
                            resolve({ loggedinstatus: true, Name, id, role })

                        } else {
                            resolve({ loggedinstatus: false })
                        }
                    })


                } else {
                    resolve({ loggedinstatus: false })
                }
            } catch (err) {
                console.log(err);
            }
        })

    },

    // view admins 

    viewAdmins: () => {
        return new Promise(async (resolve, reject) => {
            await user.admin.find({ role: { $ne: "superadmin" } }).then((response) => {

                resolve(response)
            })

        })

    },

    blockAdmin:(adminid)=>{
        return new Promise(async(resolve, reject) => {
            await user.admin.updateOne({_id:adminid},{
                $set:{
                    blocked:true
                }
            }).then((response)=>{
                console.log(response);
                resolve(response)
            })
 
 
        })
    },



    unBlockAdmin:(adminid)=>{
        return new Promise(async(resolve, reject) => {
           
                await user.admin.updateOne({_id:adminid},{
                    $set:{
                        blocked:false
                    }
                }).then((response)=>{
                    console.log(response);
                    resolve(response)
                })
     
            })

    
    },
}