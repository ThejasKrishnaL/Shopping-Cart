var db = require('../config/connection')
var collection = require('../config/collections');
const { log } = require('handlebars');
var objectId = require('mongodb').ObjectId
module.exports = {
    
    addProduct:(product,callback)=>{
        console.log(product);
        db.get().collection('product').insertOne(product).then((data)=>{
            callback(data.insertedId)
        })
    },


    getAllProducts:()=>{
        return new Promise(async(reslove,reject)=>{
            let products =await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            reslove(products)
        })
    },

    deleteProduct:(prodId)=>{
        return new Promise((reslove,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:new objectId(prodId)}).then((response)=>{
                console.log(response);
                reslove(response)
            })
        })
    },

    getProductDetails:(prodId)=>{
            return new Promise((reslove,reject)=>{
                db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:new objectId(prodId)}).then((prodId)=>{
                    reslove(prodId)
                })
            })
    },

    
    updateProduct:(prodId,ProdDetails)=>{
        return new Promise((reslove,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:new objectId(prodId)},{
                $set:{
                    Name:ProdDetails.Name,
                    Description:ProdDetails.Description,
                    Category:ProdDetails.Category,
                    Price:ProdDetails.Price
                }
            }).then((response)=>{
                reslove(response)
            })

    })},

    deleteProduct:(prodId)=>{
        return new Promise((resolve,reject)=>{
            db.get.collection(collection.PRODUCT_COLLECTION).deleteOne({_id:new objectId(prodId)}).then((response)=>{
                resolve(response)
            })
        })
    }

}