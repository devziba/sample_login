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

 async function isLoggedIn(req,res,next){
    if(req.cookies.token==="" || req.cookies.token === undefined){
            res.status(409).json({message:'not_logged_in'})
    }else{
            let data = await jwt.verify(req.cookies.token,'secret')
            req.user = data
            next();
        }
 }

app.post('/login',async (req,res)=>{
    let myUser = await user.findOne({email: req.body.email})

    if(!myUser) return res.status(404).json({message:'not_done'}) 

        let pass = await bcrypt.compare(req.body.password,myUser.password)
        if(!pass) return res.status(401).json({message:'wrong_password'})

        let token = jwt.sign({email:myUser.email,id:myUser._id},'secret')
        res.cookie('token',token)
        res.status(201).json({message:'done'})
})


app.get('/users', async (req,res)=>{
    let allUsers = await user.find()
    
    res.status(200).json({
        users:allUsers.map(
            it => it.username
        )})       
})

const PORT = process.env.PORT || 3000;
app.listen(PORT)