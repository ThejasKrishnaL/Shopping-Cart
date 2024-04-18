var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
var objectId = require('mongodb').ObjectId

module.exports = {

    doSignup:(userData)=>{
        return new Promise(async(reslove,reject)=>{
            userData.Password = await bcrypt.hash(userData.Password,10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                reslove(userData)
            })
        })
    },
    

    dologin:(userData)=>{
        return new Promise(async(reslove,reject)=>{
            let loginStatus = false
            let response = {}
            
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
            if(user){
                bcrypt.compare(userData.Password,user.Password).then((status)=>{

                    if (status) {
                        console.log("Login Success");
                        response.user = user
                        response.status = true
                        reslove(response)
                    } else {
                        console.log("Login Failed");
                        reslove({status:false})
                    }
                })

            }else{
                console.log("Login Failed");
                reslove({status:false})
            }
        })
    },

    addToCart:(prodId,userId)=>{
        return new Promise(async(reslove,reject)=>{
                let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({user: new objectId(userId)})

                if(userCart){
                    db.get().collection(collection.CART_COLLECTION)
                    .updateOne({user: new objectId(userCart)},
                    {
                            $push:{products:objectId(prodId)}
                    }
                ).then((response)=>{
                    reslove(response)
                })

                }else{

                    let cartObject={
                        user:objectId(userId),
                        products:objectId(prodId)
                    }
                    db.get().collection(collection.CART_COLLECTION).insertOne(cartObject).then((response)=>{
                            reslove(response)
                    })

                }
        })
    },

    getCartProducts:(userId)=>{
        return new Promise(async (resolve,reject)=>{
            let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:objectId(userId)}
                },
                {
                    $lookup:{
                        from:'product',
                        let:{ProdList:'$products'},
                        pipline:[
                            {
                                $match:{
                                    $expr:{
                                        $in:['$_id',"$$prodList"]
                                    }
                                }
                            },
                         ],
                          as:'cartItems'
                    }
                    
                }.toArray()
            ])
            resolve(cartItems)
     })
    }
}