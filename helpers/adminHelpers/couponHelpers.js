

const voucher_codes = require('voucher-code-generator');
const { response } = require('../../app');
const { user } = require('../../models/connection');
const db = require('../../models/connection')

module.exports = {


    generateCoupon: () => {
        return new Promise(async (resolve, reject) => {

            try {
                let couponCode = await voucher_codes.generate({
                    length: 6,
                    count: 1,
                    charset: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                    prefix: "A2Z",
                })

                resolve({ couponCode: couponCode[0] })
            } catch (err) {
                console.log(err);
            }
        })
    },

    postAddCoupon: (data, generatedCoupon) => {
        return new Promise(async (resolve, reject) => {
            let coupons = generatedCoupon.couponCode
            console.log(coupons);
            let coupon = db.coupon({
                couponName: coupons,
                expiry: data.validity,
                minPurchase: data.minpurchase,
                discountPercentage: data.discount,
                maxDiscountValue: data.maxdiscount,
                description: data.description,

            })
            console.log(coupon.counponName);
            await coupon.save().then((response) => {
                resolve(response)
            })
        })

    },

    couponValidator: async (code, userId, total) => {
        console.log(total);
        console.log(code);
        return new Promise(async (resolve, reject) => {
            try {
                let discountAmount;
                let couponTotal
           let coupon= await db.coupon.findOne({couponName:code})
               if(coupon){
                
                if (total >= coupon?.minPurchase) {                          //checking max offer value
                discountAmount = (total * coupon.discountPercentage)/ 100
                    if (discountAmount > coupon?.maxDiscountValue) {
                        discountAmount = coupon?.maxDiscountValue
                    }

                    
                }
                 couponTotal=total-discountAmount
            }else{
                resolve({status:false,err: "coupon does'nt exist"})
            }
                let couponExists = await db.coupon.findOne({ 'coupons.couponName': code })

                if (couponExists) {

                    if (new Date(couponExists.expiry) - new Date() > 0) {

                        let userCouponExists = await db.user.findOne({ _id: userId, 'coupons.couponName': code })
                        if (!userCouponExists) {
                           resolve({discountAmount,couponTotal,total,success:` ${code} `+'Coupon  Applied  SuccessFully'})
                        } else {
                            resolve({ status:true,err:"This Coupon Already Used" })
                        }
                    } else {
                        resolve({ status: false, err: 'coupon expired' })
                    }
                } else {
                    resolve({ status: false, err: "coupon does'nt exist" })
                }
            } catch (error) {
                console.log(error);
            }
        })
    },

    addCouponIntUseroDb:(couponData,userId)=>{
        let couponObj = {
            couponstatus:true,
            couponName: couponData.couponName,

        }
        return new Promise(async(resolve, reject) => {
             
        let response=   await db.user.updateOne({_id:userId},
                {
                    $push:{
                       coupons:couponObj
                    }
                })
            resolve(response)
        })
    },

    getCoupons: () => {
        return new Promise(async(resolve, reject) => {
          try {
            await db.coupon.find({}).then((data) => {
              resolve(data);
            });
          } catch (error) { }
        });
      },
    deleteCoupon: (couponId) => {
        return new Promise(async (resolve, reject) => {
          await db.coupon.deleteOne({ _id: couponId }).then((response) => {
            resolve(response);
          });
        });
      },
}