var mongoose = require("mongoose");
const db =mongoose .connect("mongodb://0.0.0.0:27017/ecommerce", {
        useNewUrlParser: true,
        useUnifiedTopology: true })   
 .then(() => console.log("Database connected!"))
 .catch(err => console.log(err));





const userschema= new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
      },
      Password: {
        type: String,
        required: true,
        // minlength: 5,
        

      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      phonenumber:{
        type:String,
        // minlength:10,
        unique:true,
      },
      blocked:{
        type:Boolean,default:false
    },
   CreatedAt:{
     type:Date,
     deafault:Date.now,
   },
  
   
})
const categorySchema= new mongoose.Schema({
  CategoryName:{
    type:String
  }

})

 const productSchema=new mongoose.Schema({
    Productname:{
      type:String
    },
    ProductDescription:{
      type:String
    },
    Quantity:{
      type:Number
    },
    Image:{
      type:String,
     

    },
    Price:{
  type:Number
    },
    category:{
      type:String
    }
    

 })

 const cartSchema=new mongoose.Schema({
  user: mongoose.Types.ObjectId,
  cartItems:[{
   products:  mongoose.Types.ObjectId,
   Quantity: Number
  }],
 })
module.exports={
 user :mongoose.model('user',userschema),
category:mongoose.model('Category',categorySchema),
  product:mongoose.model('product',productSchema),
  cart:mongoose.model('cart',cartSchema)
}



