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

    // addToCart:(prodId,userId)=>{
    //     let prodObj = {
    //         item:new objectId(prodId),
    //         quantity:1
    //     }
    //     return new Promise(async(resolve,reject)=>{
    //             let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({user: new objectId(userId)})
    //             if(userCart){
    //                 let proExist = userCart.products.findIndex(product=> product.item== prodId)
    //                 console.log(proExist);

    //             //     db.get().collection(collection.CART_COLLECTION)
    //             //     .updateOne({user: new objectId(userCart.products)},
    //             //     {
    //             //             $push:{products:prodObj}
    //             //     }
    //             // ).then((response)=>{
    //             //     resolve(response)
    //             // })

    //             }else{

    //                 let cartObj={
    //                     user:new objectId(userId),
    //                     products: [prodObj]
    //                 }
    //                 db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
    //                         resolve(response)
    //                 })

    //             }
    //     })
    // },

    // addToCart: (proId, userId) => {
    //     let proObject = {
    //       item: objectId(proId),
    //       quantity: 1,
    //     };
    //     return new Promise(async (resolve, reject) => {
    //       let userCart = await db
    //         .get()
    //         .collection(collection.USERCART)
    //         .findOne({ user: objectId(userId) });
    //       if (userCart) {
    //         let proExist = userCart.product.findIndex(
    //           (product) => product.item == proId
    //         );
    //         if (proExist != -1) {
    //           db.get()
    //             .collection(collection.USERCART)
    //             .updateOne(
    //               { user: objectId(userId), "product.item": objectId(proId) },
    //               {
    //                 $inc: { "product.$.quantity": 1 },
    //               }
    //             ).then(()=>{
    //               resolve()
    //             })

    //         }else {
    //           db.get().collection(collection.USERCART)
    //           .updateOne({ user: objectId(userId)},
    //               {
    //                 $push: { product: proObject },
    //               }
    //             )
    //         }

    //       } else {
    //         let cartObj = {
    //           user: objectId(userId),
    //           product: [proObject],
    //         };
    //         console.log(cartObj);
    
    //         db.get()
    //           .collection(collection.USERCART)
    //           .insertOne(cartObj)
    //           .then(() => {
    //             resolve();
    //           })
    //           .catch((err) => {
    //             reject(err);
    //           });
    //       }
    //     });
    //   },


    addToCart: (proId, userId) => {
      let proObject = {
        item: objectId(proId),
        quantity: 1,
      };
      return new Promise(async (resolve, reject) => {
        try {
          let userCart = await db.get().collection(collection.USERCART).findOne({ user: objectId(userId) });
          if (userCart) {
            let proExist = userCart.product.findIndex((product) => product.item.equals(objectId(proId)));
            if (proExist !== -1) {
              await db.get().collection(collection.USERCART).updateOne(
                { user: objectId(userId), "product.item": objectId(proId) },
                { $inc: { "product.$.quantity": 1 } }
              );
            } else {
              await db.get().collection(collection.USERCART).updateOne(
                { user: objectId(userId) },
                { $push: { product: proObject } }
              );
            }
          } else {
            let cartObj = {
              user: objectId(userId),
              product: [proObject],
            };
            await db.get().collection(collection.USERCART).insertOne(cartObj);
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      });
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
            console.log(cartItems);
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
      },

      changeProductQuantity:(details)=>{
        details.count = parseInt(details.count)
        console.log(cartId,prodId);
          return new Promise((resolve,reject)=>{
            db.get().collection(collection.USERCART)
            .updateOne({_id:new objectId(details.cart),"products.item":new objectId(details.product)}),
              {
                $inc: { "product.$.quantity":details.count},
              }.then((response)=>{
                resolve(response)
              })
          })
      }
}