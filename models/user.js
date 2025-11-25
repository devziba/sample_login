const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://dev:dev@cluster0.n79jkoz.mongodb.net/app_data")


const userSchema = mongoose.Schema({
            username:String,
            email:String,
            password:String
        }) 
module.exports = mongoose.model('user',userSchema)



