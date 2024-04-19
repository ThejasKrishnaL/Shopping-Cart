var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
var objectId = require('mongodb').ObjectId

module.exports = {

    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.Password = await bcrypt.hash(userData.Password,10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                resolve(userData)
            })
        })
    },
    

    dologin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus = false
            let response = {}
            
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
            if(user){
                bcrypt.compare(userData.Password,user.Password).then((status)=>{

                    if (status) {
                        console.log("Login Success");
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        console.log("Login Failed");
                        resolve({status:false})
                    }
                })

            }else{
                console.log("Login Failed");
                resolve({status:false})
            }
        })
    },

    addToCart:(prodId,userId)=>{
        return new Promise(async(resolve,reject)=>{
                let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({user: new objectId(userId)})
                if(userCart){
                    db.get().collection(collection.CART_COLLECTION)
                    .updateOne({user: new objectId(userCart.products)},
                    {
                            $push:{products: new objectId(prodId)}
                    }
                ).then((response)=>{
                    resolve(response)
                })

                }else{

                    let cartObj={
                        user:new objectId(userId),
                        products: new objectId(prodId)
                    }
                    db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                            resolve(response)
                    })

                }
        })
    },

    getCartProducts: (userId) => {
        return new Promise(async (resolve, reject) => {
          let cartItems = await db
            .get()
            .collection(collection.CART_COLLECTION)
            .aggregate([
              {
                $match: { user: new objectId(userId) },
              },
              {
                $unwind: "$products",
              },
              {
                $project: {
                  item: "$products.item",
                  quantity: "$products.quantity",
                },
              },
              {
                $lookup: {
                  from: collection.PRODUCT_COLLECTION,
                  localField: "item",
                  foreignField: "_id",
                  as: "product",
                },
              },
              {
                $project: {
                  item: 1,
                  quantity: 1,
                  product: { $arrayElemAt: ["$product", 0] },
                },
              },
            ])
            .toArray();
          resolve(cartItems);
        });
      },


      getCartCount:(userId)=>{
        return new Promise(async (resolve,reject)=>{
            let count = 0
            let cart = await db.get().collection(collection.CART_COLLECTION).findOne({user: new objectId(userId)})
            if(cart){
                count = cart.products.length
            }
            resolve(count)
        })
}
    // getCartProducts:(userId)=>{
    //     return new Promise(async (resolve,reject)=>{
    //         let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
    //             {
    //                 $match:{user:new objectId(userId)}
    //             },
    //             {
    //                 $lookup:{
    //                     from:collection.PRODUCT_COLLECTION,
    //                     let:{ProdList:'$products'},
    //                     pipline:[
    //                         {
    //                             $match:{
    //                                 $expr:{
    //                                     $in:['$_id','$$prodList']
    //                                 }
    //                             }
    //                         },
    //                      ],
    //                       as:'cartItems'
    //                 }
                    
    //             }
    //         ]).toArray()
    //         resolve(cartItems[0].cartItems)
    //  })
    // }
}