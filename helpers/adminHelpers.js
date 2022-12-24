const user =require("../models/connection");

module.exports = {
    getUsers: () => { 
        console.log(user);
        return new Promise(async (resolve, reject) => {
            let userDatas = []
            await user.user.find().exec().then((result) => {
                userDatas = result
            })
            console.log(userDatas);
            resolve(userDatas)
        })
    },
    UnblockUser: (userID) => {
        console.log(userID);
        return new Promise(async (resolve, reject) => {
            await user.user.updateOne({ _id: userID }, { $set: { blocked: false } })
            .then((data) => {
                console.log('Data updated');
                resolve()
            })
           
        })

    },
    blockUser: (userID) => {
        console.log(userID);
        return new Promise(async (resolve, reject) => {

            await user.user.updateOne({ _id: userID }, { $set: { blocked: true } })
                .then((data) => {
                    console.log('Data updated');
                    resolve()
                })
               

        })

    },
    addCategory:(data)=>{
        new Promise(async(resolve,reject)=>{
           const categoryData=new user.category({
            CategoryName:data.categoryname
           })
            
           await categoryData.save().then((response)=>{
           
            resolve(response)
             console.log(response);
           })
        })
    },
    viewAddCategory:()=>{
        new Promise(async(resolve, reject) => {
            await user.category.find().exec().then((response)=>{
                console.log(response);
                resolve(response)
                console.log(response);
            })
        })
    }

}