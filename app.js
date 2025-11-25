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
        res.status(201).json({message:'done'})
    }else{
    res.status(409).json({message:'not_done'}) 
    }
})

 function isLoggedIn(req,res,next){
    if(req.cookies.token==="" || req.cookie.token === undefined){
            res.json({message:'not_logged_in'})
    }else{
            let data = jwt.verify(req.cookies.token,'secret')
            req.user = data
            next();
        }
    
 }

app.post('/login',async (req,res)=>{
    let myUser = await user.findOne({email: req.body.email})
    if(myUser){
        let token = jwt.sign({email:createdUser.email,id:createdUser._id},'secret')
        res.cookie('token',token)
        res.status(201).json({message:'done'})
       
    }else{
     res.status(409).json({message:'not_done'}) 
    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT)