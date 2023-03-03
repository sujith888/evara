const user = require("../../models/connection");
const bcrypt = require('bcrypt');
const { response } = require("../../app");
const ObjectId = require('mongodb').ObjectId

module.exports = {
  //sign up

  
  doSignUp: (userData) => {
    let response = {};
    return new Promise(async (resolve, reject) => {

      try {
        email = userData.email;
        existingUser = await user.user.findOne({ email })
        if (existingUser) {
          response = { status: false }
          return resolve(response)

        }
        else {
          let hashedPassword = await bcrypt.hash(userData.password, 10);
          const data = new user.user({

            username: userData.username,
            Password: hashedPassword,
            email: userData.email,
            phonenumber: userData.phonenumber,
          })

          await data.save(data).then((data) => {
            resolve({ data, status: true })
          })
        }
      }

      catch (err) {
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
          if (users.blocked == false) {
            await bcrypt.compare(userData.password, users.Password).then((status) => {
              if (status) {
                userName = users.username
                id = users._id
                // response.status
                resolve({ response, loggedinstatus: true, userName, id })
                console.log(userName);
              } else {
                resolve({ loggedinstatus: false })
              }
            })
          }
          else {
            resolve({ blockedStatus: true })
          }


        } else {
          resolve({ loggedinstatus: false })
        }
      } catch (err) {
        console.log(err);
      }
    })


  },

  // add to cart

  addToCartItem: (proId, userId) => {
    console.log(proId);
    proObj = {
      productId: proId,
      Quantity: 1

    }
    return new Promise(async (resolve, reject) => {


      let carts = await user.cart.findOne({ user: userId })
      if (carts) {

        let productExist = carts.cartItems.findIndex(cartItems => cartItems.productId == proId)
        // console.log(cartItems);

        if (productExist != -1) {
          console.log(productExist);
          user.cart.updateOne({ 'user': userId, 'cartItems.productId': proId }, {
            $inc: { 'cartItems.$.Quantity': 1 }
          }).then((response) => {
            console.log(response + "inc");
            resolve({ response, status: false })

          })
        } else {

          await user.cart.updateOne({ user: userId },
            {
              "$push":
              {
                "cartItems": proObj
              }
            }).then((response) => {
              resolve({ response, status: true })

            })
        }
      } else {
        let cartItems = new user.cart({
          user: userId,


          cartItems: proObj

        })
        console.log(cartItems + "proid");
        await cartItems.save().then(() => {
          resolve({ status: true })


        });



      }
    })
  },


  // list cart 

  listAddToCart: (userId) => {
    return new Promise(async (resolve, reject) => {


      const id = await user.cart.aggregate([
        {
          $match: {
            user: ObjectId(userId)
          }
        },
        {
          $unwind: '$cartItems'
        },


        {
          $project: {
            item: '$cartItems.productId',
            quantity: '$cartItems.Quantity'
          }
        },


        {
          $lookup: {
            from: 'products',
            localField: "item",
            foreignField: "_id",
            as: 'carted'
          }
        },
        {
          $project: {
            item: 1, quantity: 1, carted: { $arrayElemAt: ['$carted', 0] }
          }

        },
      
      ]).then((cartItems) => {

        resolve(cartItems)


      })


    })
  },




  


  //get cart count 

  getCartCount: (userId) => {
    console.log('api called');
    return new Promise(async (resolve, reject) => {
      let count = 0;
      let cart = await user.cart.findOne({ user: userId })
      // console.log(cart);
      if (cart) {
        count = cart.cartItems.length
      }
      resolve(count)

    })
  },




  // total checkout amount 

  totalCheckOutAmount: (userId) => {

    return new Promise(async (resolve, reject) => {


      const id = await user.cart.aggregate([
        {
          $match: {
            user: ObjectId(userId)
          }
        },
        {
          $unwind: '$cartItems'
        },


        {
          $project: {
            item: '$cartItems.productId',
            quantity: '$cartItems.Quantity'
          }
        },


        {
          $lookup: {
            from: 'products',
            localField: "item",
            foreignField: "_id",
            as: 'carted'
          }
        },
        {
          $project: {
            item: 1, quantity: 1, product: { $arrayElemAt: ['$carted', 0] }
          }

        },
        {
          $group: {
            _id: null,
            total: { $sum: { $multiply: ["$quantity", "$product.Price"] } }
          }
        }
      
      ]).then((total) => {


  
        resolve(total[0]?.total)


      })

    })

  },
  
  subtotal: (userId) => {
    return new Promise(async (resolve, reject) => {


      const id = await user.cart.aggregate([
        {
          $match: {
            user: ObjectId(userId)
          }
        },

        {
          $unwind: '$cartItems'
        },


        {
          $project: {
            item: '$cartItems.productId',
            quantity: '$cartItems.Quantity'

          }
        },


        {
          $lookup: {
            from: 'products',
            localField: "item",
            foreignField: "_id",
            as: 'carted'
          }
        },
        {
          $project: {
            item: 1, quantity: 1,

            price: {
              $arrayElemAt: ['$carted.Price', 0]


            }
          },
        },
        {

          $project: {
            total: { $multiply: ["$quantity", "$price"] }
          }
        },
      


      ]).then((total) => {

        console.log(total[0]);

  resolve(total)


      })
    })
  },

  
}
