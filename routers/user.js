const express= require('express')
const User=require('../models/user')
const auth=require('../middleware/authentication')
const bcrypt= require('bcryptjs')
const app=express()


const bodyParser = require('body-parser')
// app.use(bodyParser.urlencoded({ extended: false })); 
// app.use(bodyParser.json());
const router= new express.Router()

//using asycn await syntax for the above post req
router.post('/users', async(req,res)=>{
    const user= new User(req.body)

    try{
        
        await user.save()
        const token= await user.generateToken() //after the user is saved we generate its token
        res.status(201).send({user, token})
    } catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/login', async(req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password) //creating a method and it is worjed up in user model
        const token= await user.generateToken() //here we user user and not User, it says that the token is being used on a single user and not the User model

        res.send({user , token}) //we are sending 2 things user and token generated so using an object we send back
    }catch(e){
        console.log(e.message)
        res.status(400).send(e.message)
    }
    
})

// router.post('/users/login', async(req,res)=>{
//     try{
//         const user= await User.findOne({email})
//         if(!user){
//             throw new Error("invalid user")
//         }
//         const isMatch= await bcrypt.compare(password,user.password)
//         if(!isMatch){
//             throw new Error("invalid login")
//         }
//         res.send(user)
//     }catch(e){
//         console.log(e)
//         res.status(400).send(e.message)
//     }
//  })

//to fetch all users
// router.get('/users', auth, async(req,res)=>{
    
//      try{
//         const users=  await User.find({})
//         res.status(200).send(users)
//      }catch(e){
//         res.status(500).send(e)
//      }
//     // User.find({}).then((users)=>{       //users is an array where all the data is stored of User model
//     //     res.send(users)
//     // }).catch((e)=>{
//     //     res.status(500).send(e)
//     // })
//})

//to fetch own profile
router.get('/users/me', auth, async(req,res)=>{
    res.send(req.user)
})


// to fetch single user
// router.get('/users/:id',async (req,res)=>{
//     // console.log(req.params) //id or whaterver parameter given to the url after users will be stored in params so we are requesting the data from params so req.params console will log the details to cmd
//     const _id= req.params.id //storing the value from req.params.id id bcz thats what provided in the url  to _id
    
//     try{
//         const user= await User.findById(_id)
//         if(!user){
//             return res.status(404).send()
//         }
//         res.status(200).send(user)
//     }catch(e){
//         res.status(404).send(e)
//     }

//     // User.findById(_id).then((user)=>{
//     //     if(!user) {
//     //        return res.status(404).send()
//     //     }

//     //     res.send(user)
//     // }).catch((e)=>{
//     //     res.status(500).send()
//     // })
//}) 

//to logout
router.post('/users/logout', auth, async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

//to logoutall
router.post('/users/logoutAll', auth, async(req, res)=>{
    try{
        req.user.tokens= []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})


//to find a user either by name or else use find if more than one user with same details or else findOne
// router.get('/users/:name',async (req,res)=>{
//     console.log(req.params)
//     const name=req.params.name
    
//     try{
//         const user= await User.find({name})
//         if(!user){
//             res.status(404).send()
//         }
//         res.status(200).send(user)
//         console.log(user)
//     } catch(e){
//         res.status(400).send(e)
//         console.log(e)
//     }
    // User.find({name}).then((user)=>{
    //     if(!user){
    //         return res.status(404).send()
    //     }

    //     res.send(user)
    // }).catch((e)=>{
    //     res.status(500).send(e)
    //     console.log(e)
    // })
//})

//updating a user by id
router.patch('/users/me', auth, async(req,res)=>{
    const updates= Object.keys(req.body)
    const allowedUpdates=['name','password','age']
    const isValidOperations=updates.every((update)=> allowedUpdates.includes(update))

    if(!isValidOperations){
        return res.status(400).send({error: 'Invalid updates!'})
    }

    const _id=req.params.id
    try{
        //findByIdAndUpdate method surpasses the mongoose schema and so the pre save method of schema is not able to access it so for that to work we need to restructure this one line below 
        //const user= await User.findByIdAndUpdate(_id)
        //now for updates there is an array of strings called updates using foreach we will traverse every update mentioned and see which one is being in use
        updates.forEach((update)=> req.user[update]=req.body[update]) //we are accesing every update on that user, we didnt use user.update bccz not supported like user[name]=req.body[name] is happening above
            await req.user.save() //saving the user after changes.
        

        //const user= await User.findByIdAndUpdate(_id, req.body, {new: true, runValidators:true}) //_id is requesting the params i.e the things that holds the paramter values, then req.body is whatever is written in the body is requested so that it is taken for updates, and { } are options but these are required
        // if(!user){
        //     return res.status(404).send()
        // }
        res.send(req.user)

    }catch(e){
        res.status(500).send(e)
    }
})

//deleting a user by its id, i.e oneself
router.delete('/users/me', auth, async(req,res)=>{
    try{
        const user= await User.findByIdAndDelete(req.user._id)
        req.user.remove()
        res.status(200).send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports=router