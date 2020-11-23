const express=require('express')
require('./db/mongoose')
const User=require('./models/user')
const Task=require('./models/task')
const userRouter=require('./routers/user')
const taskRouter= require('./routers/task')
// const bodyParser=require('body-parser')
// const { Router } = require('express')


const app=express()
const port= process.env.PORT || 3000

//app.use((req,res,next)=>{ //express middleware,what it does is that when user req something it performs but we add a condition next(),which means that it will keep hanging on a request if next isn't called
    // console.log(req.method, req.path) //it wil display method name i,e get/post, and path is /users, /users/login
    // next() //on calling next we can actually perform the operation which was previously stuck

//})

//setting up middleware
// app.use((req,res,next)=>{
//     if(req.method==='GET' || 'POST' || 'PATCH' || 'DELETE'){
//         res.send('Site under maintainance')
//     }
//     else{
//         next()
//     }
// }) //OR

// app.use((req,res,next)=>{
//     res.status(503).send('Site under maintainance. Check back later')
// })

//creating a new router syntax
// const router= new express.Router() //creating a router
// router.get('/test',(req,res)=>{
//     res.send('this is one router')
// }) //entire thing to set up a router

// app.use(router) //using router through app.use

app.use(express.json()) //express. json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object. if you wont use it iwll give errors bcz it wont understand what the field is
app.use(userRouter)
app.use(taskRouter)

//creating the user
// app.post('/users', (req,res) => {
//     //creating instance of user
//     const user= new User(req.body) //instance of user is already present in the body so we do a req to body to create its instance
//     user.save().then(()=>{
//         res.send(user)
//     }).catch((error)=>{
//         res.status(400).send(error)
//     })
// })


//learn to hash a password
//  const bcrypt=require('bcryptjs')

//  const myFunction=async ()=>{
//     const password='qwerty1234'
//     const hashPassword= await bcrypt.hash(password,8) //bcrypt.hash hash is a function to hash the password. it accepts 2 parameters, one is the plain text pw stored in password, while 8 is the no. of rounds, we want the hashing algo to owrk, 8 fits the perfect balnce btw security and running not to slow.
//     console.log(password)
//     console.log(hashPassword) 
//     //comparing if the entered password matches 
//     const isMatch= await bcrypt.compare('qwerty1234', hashPassword)
//     console.log(isMatch)

//  }
  
// myFunction()

// //learning jwt
// const jwt=require('jsonwebtoken')

// const myFunction= async () =>{
//     const token= jwt.sign({_id:' abc1234'}, 'thisistrial', {expiresIn: '1 day'}) //to generate token we should use jwt and it takes an object also called payload here an id unique to every user and second is a string called securityKey
//     console.log(token)
//     //to verify if the token matches. 
//     const data=jwt.verify(token, 'thisistrial')
//     console.log(data)
// }

// myFunction()
 
app.listen(port, ()=>{
    console.log('server is up on port ' +port)
})