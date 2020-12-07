const express= require('express')
const Profile=require('../models/profile')
const auth=require('../middleware/authentication')
const app=express()
const bodyParser = require('body-parser')
const router= new express.Router()

router.post('/profiles', auth, async(req,res)=>{
    //const profile= new Profile(req.body)
    const profile = new Profile({
        ...req.body,
        owner:req.user._id
    })
   
    try{
        await profile.save()
        res.status(201).send(profile)
        
    }catch(e){
        res.status(400).send(e)
        console.log(e)

    }
})


router.get('/profiles/me', auth, async(req,res)=>{
    try{
        const profile= await Profile.find({owner: req.user._id})
        res.send(profile)   
    }catch(e){
        res.status(500).send(e)
    }
    
})


//CAN SEE EVERYONE'S PROFILE
// router.get('/profile/view', auth, async(req,res)=>{
//     try{
//         const profiles= await Profile.find({})
//         res.send(profiles)
//         console.log(profiles)
//     }catch(e){
//         res.status(500).send(e)
//         console.log(e)
//     }
// })

router.patch('/profiles/me', auth, async(req,res)=>{
    const updates= Object.keys(req.body)
    const allowedUpdates=['FirstName','LastName','ContactNumber','AboutYourSelf']
    const isValidOperations=updates.every((update)=> allowedUpdates.includes(update))

    if(!isValidOperations){
        return res.status(400).send({error: 'Invalid updates!'})
    }

    const _id=req.params.id
    try{
        //findByIdAndUpdate method surpasses the mongoose schema and so the pre save method of schema is not able to access it so for that to work we need to restructure this one line below 
        //const user= await User.findByIdAndUpdate(_id)
        //now for updates there is an array of strings called updates using foreach we will traverse every update mentioned and see which one is being in use
        updates.forEach((update)=> req.profile[update]=req.body[update]) //we are accesing every update on that user, we didnt use user.update bccz not supported like user[name]=req.body[name] is happening above
            await req.profile.save() //saving the user after changes.
        

        //const user= await User.findByIdAndUpdate(_id, req.body, {new: true, runValidators:true}) //_id is requesting the params i.e the things that holds the paramter values, then req.body is whatever is written in the body is requested so that it is taken for updates, and { } are options but these are required
        // if(!user){
        //     return res.status(404).send()
        // }
        res.send(req.profile)

    }catch(e){
        res.status(500).send(e)
        console.log(e)
    }
})
module.exports=router