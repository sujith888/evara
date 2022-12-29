
const userproductHelpers = require('../../helpers/UserHelpers/userProduct')

const session=require('../usercontroller/usercontroller')


module.exports = {


  //shop

  shopProduct: (req, res) => {
    userproductHelpers.shopListProduct().then((response) => {
      res.render('user/shop', { response })
    })

  },

  imageZoom:(req,res)=>{

userproductHelpers.imageZoom(req.params.id).then((response) => {
   image=response
   console.log(image);
  
    res.render('user/imagezoom',{image})
})
},


}