const userhelpers = require('../../helpers/UserHelpers/UserHelpers')
const otpLogin = require('../../OTP/otpLogin')
const client = require('twilio')(otpLogin.AccountSId, otpLogin.authtoken)
const user = require("../../models/connection");


let loggedinstatus;
let Number;


module.exports = {


  // user home
  getHome: (req, res) => {
    let users = req.session.user
    res.render('user/user', { users })

  },
  // get user login
  getUserLogin: (req, res) => {

    if (req.session.loggedIn) {
      res.redirect('/')
    } else {
      res.render("user/login")
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
      res.redirect('/')
    } else {
      res.render("user/signup", { emailStatus });
    }
  },
  //post sign up
  postSignUp: (req, res) => {
    userhelpers.doSignUp(req.body).then((response) => {
      req.session.userloggedIn = true

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

    req.session.loggedIn = false
    res.render('user/user')

  },


  // get add-to-cart 

  addToCart: (req, res) => {
    console.log(req.params.id);
    userhelpers.addToCartItem(req.params.id, req.session.user.id).then((response) => {
      console.log(response);
    })
    res.redirect('/')
  },



  //get otp page

  getOtp: (req, res) => {

    res.render('user/otp')
  },

  //post otp

  postOtp: async(req, res) => {
    console.log(req.body.phonenumber);
    Number = req.body.phonenumber;
    let users =  await user.user.find({ phonenumber: Number }).exec()
    console.log(users);
    if (users == false) {
       res.redirect('/login')
    } else {
      client.verify.v2
        .services(otpLogin.servieceId)
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
    OtpNumber=req.body.number
    console.log(Number + '  Phone number');
    console.log(Number + '  otp');
    client.verify.v2
      .services(otpLogin.servieceId)
      .verificationChecks.create({ to: `+91 ${Number}`, code:OtpNumber})
      .then((verification_check) => { console.log(verification_check.status);
        console.log(verification_check);
      if(verification_check.valid){
           res.redirect('/')
       }else{
        res.render('user/otpverify',{status:false})
       }
      
      }
      )
        
  },
}

