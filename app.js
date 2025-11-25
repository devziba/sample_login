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
    try{

    
    let salt = await bcrypt.genSalt(10)
    let hash = await bcrypt.hash(req.body.password,salt)

    let createdUser= await user.create({
        name:req.body.name,
        email:req.body.email,
        password: hash
    })
    let token = jwt.sign({email:createdUser.email,id:createdUser._id},'secret')
    res.cookie('token',token,{
        httpOnly:true,
        secure:true
    })
    res.status(200).json({message:'okay'})
} catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));