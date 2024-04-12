var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')

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
    }



    // doSignup: (userData) => {
    //     return new Promise(async (resolve, reject) => {
    //       userData.Password = await bcrypt.hash(userData.password, 10);
    //       db.get()
    //         .collection(USER_COLLECTION)
    //         .insertOne(userData)
    //         .then((data) => {
    
    //           resolve(userData);
    //         })
    //     });
    //   },


    // doLogin: (logindata) => {
    //     return new Promise(async (resolve, reject) => {
    //       let loginStatus = false;
    //       let response = {};
    //       let user = await db
    //         .get()
    //         .collection(USER_COLLECTION)
    //         .findOne({ email: logindata.email });
    //       if (user) {
    //         bcrypt.compare(logindata.password, user.password).then((status) => {
    //           if (status) {
    //             response.user = user;
    //             response.status = true;
    //             resolve(response);
    //             console.log("Loginned Successfully");
    //           } else {
    //             console.log("Login failed");
    //             resolve({ status: false });
    //           }
    //         });
    //       } else {
    //         console.log("user not Found");
    //       }
    //     });
    //   }
}