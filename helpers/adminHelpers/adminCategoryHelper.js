const user = require("../../models/connection");
const multer = require('multer');
const { response } = require("../../app");



module.exports = {

    //add category

    addCategory: (data) => {
        return new Promise(async (resolve, reject) => {

            let categories = await user.category.findOne({ categoryName: data.categoryname })


            if (categories) {

                await user.category.updateOne({ categoryName: data.categoryname },
                    {
                        '$push': {

                            subcategories: { subcategoryName: data.subcategoryname }
                        }
                    }).then((data) => {
                        resolve({data,categorystatus:true})
                    })

            } else {
                let categorysub = {
                    subcategoryName: data.subcategoryname
                }
                const categoryData = new user.category({
                    categoryName: data.categoryname,
                    subcategories: categorysub
                })
                await categoryData.save().then((data) => {
                    resolve({data,categorystatus:false})
                })
            }

        })

    },

    //view category

    viewAddCategory: () => {
        return new Promise(async (resolve, reject) => {
            await user.category.find().exec().then((response) => {
                console.log(response);
                resolve(response)

            })
        })
    },
    // delete category


    deleteCatogory: (CategoryId) => {
        return new Promise(async (resolve, reject) => {
            await user.category.deleteOne({ _id: CategoryId }).then((data) => {
                console.log(data);
                resolve(data)
            })
        })
    },

    // edit categoty

    editCategory: (editCategoryId) => {
        return new Promise(async (resolve, reject) => {
            await user.category.find({ _id: editCategoryId }).exec().then((response) => {
                console.log(response + "edit cate");
                resolve(response[0])
            })
        })
    },
    //post edit ctaegory

    postEditCategory: (editedId, editedData) => {
        console.log(editedData.editsubCategoryname);
        return new Promise(async (resolve, reject) => {
            await user.category.updateOne({ _id: editedId }, { $set: { categoryName: editedData.editCategoryname, subcategories: { subcategoryName: editedData.editsubCategoryname } } }).then((response) => {
                console.log(response);
                resolve(response)
                console.log("================mAINRESPONSE++++++++++");
            })
        })
    },
}

