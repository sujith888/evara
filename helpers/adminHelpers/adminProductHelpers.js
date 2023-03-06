const user = require("../../models/connection");
const multer = require('multer');
const { response } = require("../../app");
const { product } = require("../../models/connection");
const ObjectId = require('mongodb').ObjectId




module.exports = {



  //get add product

  getAddProduct: () => {
    return new Promise(async (resolve, reject) => {
      await user.category.find().exec().then((response) => {

        resolve(response)
      })
    })
  },

  //post add product

  postAddProduct: (userdata, filename) => {
    return new Promise((resolve, reject) => {




      ImageUpload = new user.product({
        Productname: userdata.name,
        ProductDescription: userdata.description,
        Quantity: userdata.quantity,
        Image: filename,
        SubCategory: userdata.subcategory,
        category: userdata.category,
        Price: userdata.price



      })
      ImageUpload.save().then((data) => {

        resolve(data)

      })
    })


  },
  //get view product

  getViewProduct: () => {

    return new Promise(async (resolve, reject) => {
      await user.product.find().exec().then((response) => {

        console.log(response.length + ">>>>>>>>>>>>>>>");
        resolve(response)

      })
    })
  },
  //delete view product

  deleteViewProduct: (productId) => {
    return new Promise(async (resolve, reject) => {
      await user.product.deleteOne({ _id: productId }).then((response) => {
        resolve(response)
      })
    })
  },
  //edit product

  editProduct: (productId) => {
    return new Promise(async (resolve, reject) => {
      await user.product.findOne({ _id: productId }).exec().then((response) => {
        console.log(response);
        resolve(response)


      })
    })
  },
  //post editproduct

  postEditProduct: (productId, editedData, images) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await user.product.updateOne(
          { _id: productId },
          {
            $set: {
              Productname: editedData.name,
              ProductDescription: editedData.description,
              Quantity: editedData.quantity,
              Price: editedData.price,
              category: editedData.category,
              SubCategory: editedData.subcategory,
              Image: images
            }
          }
        );
        resolve(response);
      } catch (err) {
        reject(err);
      }
    });
  },
  //  imported from view category

  viewAddCategory: () => {
    return new Promise(async (resolve, reject) => {
      await user.category.find().exec().then((response) => {

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

        resolve(response)

      })
    })

  },

  // view order users order details



  orderDetails: (orderId) => {
    return new Promise(async (resolve, reject) => {

      let order = await user.order.findOne({ 'orders._id': orderId }, { 'orders.$': 1 })
      resolve(order)
    })

  },

  // change order status

  changeOrderStatus: (orderId, data) => {
    console.log(orderId);
    return new Promise(async (resolve, reject) => {
      let orders = await user.order.findOne({ 'orders._id': orderId }, { 'orders.$': 1 })
      console.log(orders);

      let users = await user.order.updateOne(
        { 'orders._id': orderId },
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
  findSubcategory: (categoryname) => {

    return new Promise(async (resolve, reject) => {
      let result = await user.category.findOne({ categoryName: categoryname }).then((response) => {
        resolve(response)
      })

      resolve(result)

    })
  },


  OrderPage: (userId) => {
    return new Promise(async (resolve, reject) => {
      console.log(userId);
      let response = await user.order.find({ userid: userId })

      resolve(response)

    })
  },

  // add banner

  addBanner: (texts, Image) => {

    return new Promise(async (resolve, reject) => {

      let banner = user.banner({
        title: texts.title,
        description: texts.description,
        link: texts.link,
        image: Image

      })
      await banner.save().then((response) => {
        resolve(response)
      })
    })
  },

  /// list banner
  listBanner: () => {

    return new Promise(async (resolve, reject) => {
      await user.banner.find().exec().then((response) => {
        resolve(response)
      })
    })
  },

  // edit banner

  editBanner: (bannerId) => {

    return new Promise(async (resolve, reject) => {

      let bannerid = await user.banner.findOne({ _id: bannerId }).then((response) => {
        resolve(response)
      })

    })

  },

  //post edit banner

  postEditBanner: (bannerid, texts, Image) => {

    return new Promise(async (resolve, reject) => {

      let response = await user.banner.updateOne({ _id: bannerid },
        {
          $set: {

            title: texts.title,
            description: texts.description,
            // created_at: updated_at,
            link: texts.link,
            image: Image
          }

        })
      resolve(response)
    })

  },

  // dash board mangement helper functions 


  getOrderByDate: () => {
    return new Promise(async (resolve, reject) => {
      const startDate = new Date('2022-01-01');
      await user.order.find({ createdAt: { $gte: startDate } }).then((response) => {
        resolve(response)

      })
    });
  },

  // get all orders 

  getAllOrders: () => {
    return new Promise(async (resolve, reject) => {
      let order = await user.order.aggregate([
        { $unwind: '$orders' },

      ]).then((response) => {
        resolve(response)
      })

    })
  },


  getCodCount: () => {
    return new Promise(async (resolve, reject) => {
      let response = await user.order.aggregate([
        {
          $unwind: "$orders"
        },
        {
          $match: {
            "orders.paymentmode": "COD"
          }
        },
      ])
      resolve(response)
    })
  },


  getOnlineCount: () => {
    return new Promise(async (resolve, reject) => {
      let response = await user.order.aggregate([
        {
          $unwind: "$orders"
        },
        {
          $match: {
            "orders.paymentmode": "online"
          }
        },
      ])
      resolve(response)
    })
  },

  totalUserCount: () => {

    return new Promise(async (resolve, reject) => {
      let response = await user.user.find().exec()

      resolve(response)

    })
  },

  // sales report

  getSalesReport: async () => {
    return new Promise(async (resolve, reject) => {
      let response = await user.order.aggregate([
        {
          $unwind: "$orders"
        },
        {
          $match: {
            "orders.OrderStatus": "Delivered"
          }
        },
      ])
      console.log(response);
      resolve(response)
    })
  },

  // post sale report


  postReport: (date) => {
    let start = new Date(date.startdate);
  let end = new Date(date.enddate);

  return new Promise(async(resolve, reject) => {
  await user.order.aggregate([
  {
    $unwind: "$orders",
  },
  {
    $match: {
      $and: [
        { "orders.OrderStatus": "Delivered" },
        {"orders.createdAt": { $gte: start, $lte: end }}
        
      ]
    }
  }
])
  .exec()
  .then((response) => {
    console.log(response);
    resolve(response)
  })
})

  },
}



