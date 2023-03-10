
const db = require("../../models/connection");
const multer = require('multer');
const { response } = require("../../app");
const bcrypt = require('bcrypt');


module.exports={

//view users order list

orderPage: () => {
    return new Promise(async (resolve, reject) => {

      await db.order.aggregate([
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

      let order = await db.order.findOne({ 'orders._id': orderId }, { 'orders.$': 1 })
      resolve(order)
    })

  },


  
  // change order status

  changeOrderStatus: (orderId, data) => {
    console.log(orderId);
    return new Promise(async (resolve, reject) => {
      let orders = await db.order.findOne({ 'orders._id': orderId }, { 'orders.$': 1 })
      console.log(orders);

      let users = await db.order.updateOne(
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


  OrderPage: (userId) => {
    return new Promise(async (resolve, reject) => {
      console.log(userId);
      let response = await db.order.find({ userid: userId })

      resolve(response)

    })
  },

}