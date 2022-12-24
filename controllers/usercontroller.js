const userhelpers=require('../helpers/userhelpers')

var logheader, loginStatus;

  module.exports={
   
getHome:(req,res)=>{
  if(loginStatus){
    //logheader=true
    //console.log(logheader);
   res.render('user/user',{logheader:true})
  }else{
    //logheader=false
    //console.log(logheader);
   res.render('user/user',{logheader:false})

  }

 
},
getUserLogin: (req, res)=> {
  logheader=false
    // loginStatus=true
    res.render("user/login",{logheader:false});
  },
   postUserLogin:  (req, res) =>{
   userhelpers.doLogin(req.body).then((response)=>{
     logheader=true;
    loginStatus=response.status;
    var blockedStatus=response.blockedStatus
    console.log(loginStatus);
    if(loginStatus==true)
   
  {
    res.redirect('/')
     }else{
      console.log(blockedStatus +'blocked status');
      console.log(loginStatus +'log');

  
      res.render('user/login',{loginStatus,blockedStatus,login:false})
     }
  })
    
  },
  getSignUp: (req, res)=>{
    emailStatus=true
    res.render("user/signup",{emailStatus});
  },
   postSignUp:(req, res)=> {
    userhelpers.doSignUp(req.body).then((response)=>{
      
      var emailStatus=response.status
     if(emailStatus==true){
      res.redirect('/login')
     }else{
  
      res.render('user/signup',{emailStatus})
     }
          
    })
    },
    getLogout:(req,res)=>{
   logheader=false;
   loginStatus = false;

        res.redirect('/');
  
} 
 }