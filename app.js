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


app.get('/register',async (req,res)=>{
    res.send('hello')
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));