const userhelpers = require('../../helpers/UserHelpers/UserHelpers')
const otpLogin = require('../../allKeys/otpLogin')
const client = require('twilio')(otpLogin.AccountSId, otpLogin.authtoken)
const user = require("../../models/connection");
const { log } = require('console');
const userProduct = require('../../helpers/UserHelpers/userProduct');
const { cart } = require('../../models/connection');
const productHelpers = require('../../helpers/UserHelpers/productHelpers');
const profileHelper = require('../../helpers/UserHelpers/profileHelper')

let loggedinstatus;
let Number, wishCount, count, users;

module.exports = {


  // user home
  getHome: async (req, res) => {


    if (req.session.loggedIn) {
      users = req.session.user
      let response = await productHelpers.bestSeller()

      wishCount = await userProduct.getWishCount(req.session.user.id)
      let count = await userhelpers.getCartCount(req.session.user.id)
      res.render('user/user', { users, count, wishCount, response })

    }




  },
  // get user login
  getUserLogin: (req, res) => {

    if (req.session.loggedIn) {
      res.redirect('/')
    } else {
      res.render("user/user-Dashboard")
    }
  },
  // post user login
  postUserLogin: (req, res) => {
    userhelpers.doLogin(req.body).then((response) => {
      req.session.loggedIn = true
      console.log(response);
      req.session.user = response

      let loggedinstatus = response.loggedinstatus
      let blockedStatus = response.blockedStatus
      console.log(loggedinstatus + "loggedinstatus");

      if (loggedinstatus == true) {
        res.redirect('/')
      } else {

        res.render('user/login', { blockedStatus, loggedinstatus })

      }
    })

  },
  //get signup

  getSignUp: (req, res) => {
    emailStatus = true
    if (req.session.userloggedIn) {
      res.redirect('/login')
    } else {
      res.render("user/signup", { emailStatus });
    }
  },
  //post sign up
  postSignUp: (req, res) => {
    userhelpers.doSignUp(req.body).then((response) => {


      var emailStatus = response.status
      if (emailStatus == true) {
        res.redirect('/login')
      } else {

        res.render('user/signup', { emailStatus })
      }

    })
  },
  //getuser logout


  getLogout: (req, res) => {

    req.session.loggedIn = null
    res.render('user/login')

  },


  // get add-to-cart 

  addToCart: async (req, res) => {


    userhelpers.addToCartItem(req.params.id, req.session.user.id).then((response) => {
      res.json(response.status)

    })

  },

  //list cart  page

  listCart: async (req, res) => {

    users = req.session.user
    let userId = req.session.user
    let total = await userhelpers.totalCheckOutAmount(req.session.user.id)
    count = await userhelpers.getCartCount(req.session.user.id)
    userhelpers.listAddToCart(req.session.user.id).then((cartItems) => {
      res.render('user/cart', { cartItems, total, userId, users, count, wishCount })
    })
  },






  //get otp page

  getOtp: (req, res) => {

    res.render('user/otp')
  },

  //post otp

  postOtp: async (req, res) => {
    console.log(req.body.phonenumber);
    Number = req.body.phonenumber;
    users = await user.user.find({ phonenumber: Number }).exec()
    console.log(users);
    if (users == false) {
      res.redirect('/login')
    } else {
      client.verify.v2
        .services(otpLogin.serviceId)
        .verifications.create({ to: `+91 ${Number}`, channel: "sms" })
        .then((verification) =>
          console.log(verification.status))
        .then(() => {
          const readline = require("readline").createInterface({
            input: process.stdin,
            output: process.stdout,
          })

        })

    }
    res.render('user/otpverify')
  },


  getVerify: (req, res) => {
    res.render('user/otpPage')
  },

  postVerify: (req, res) => {
    console.log(req.body);
    OtpNumber = req.body.number
    console.log(Number + '  Phone number');
    console.log(Number + '  otp');
    client.verify.v2
      .services(otpLogin.serviceId)
      .verificationChecks.create({ to: `+91 ${Number}`, code: OtpNumber })
      .then((verification_check) => {
        console.log(verification_check.status);
        console.log(verification_check);
        if (verification_check.valid) {
          res.redirect('/')
        } else {
          res.render('user/otpverify', { status: false })
        }

      }
      )

  },

  getProfile: async (req, res) => {
    let data = await profileHelper.findUser(req.session.user.id);
    res.render("user/profile", { users, data });
  },

  updateProfile: (req, res) => {
    console.log(req.body);
     console.log(req.query.userId);
     profileHelper.updateProfile(req.body, req.query.userId).then((data) => {
      res.json({ data });
    });
  },
}

