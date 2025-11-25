const express = require('express')
const app = express()
const path = require('path')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken') 
const bcrypt = require('bcrypt')
const user = require('./models/user')


app.set('view engine','ejs')
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname,'public')))
app.use(express.json())


app.post('/register',async (req,res)=>{
    let myUser = await user.findOne({email: req.body.email})
    if(!myUser){
        let salt = await bcrypt.genSalt(10)
        let hash = await bcrypt.hash(req.body.password,salt)
       let createdUser = await user.create({
            username: req.body.username,
            email:req.body.email,
            password: hash,
        })
        let token = jwt.sign({email:createdUser.email,id:createdUser._id},'secret')
        res.cookie('token',token)
        res.json({message:'done'})
    }else{
    res.json({message:'not_done'})
    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT)