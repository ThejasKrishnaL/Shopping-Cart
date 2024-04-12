var db = require('../config/connection')
var collection = require('../config/collections')
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
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id: new objectId(prodId)}).then((response)=>{
                console.log(response);
                reslove(response)
            })
        })
    },

    getProductDetails:(proId)=>{
            return new Promise((reslove,reject)=>{
                db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id: new objectId(proId)}).then((product)=>{
                    reslove(product)
                })
            })
    },

    
    updateProduct:(prodId,ProdDetails)=>{
        return new Promise((reslove,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id: new objectId(prodId)},{
                $set:{
                    Name:ProdDetails.Name,
                    Description:ProdDetails.Description,
                    Category:ProdDetails.Category,
                    Price:ProdDetails.Price
                }
            }).thene((response)=>{
                reslove(response)
            })

    })}

}