const express= require('express')
const Blog=require('../models/blog')
const auth=require('../middleware/authentication')
//const bcrypt= require('bcryptjs')
const app=express()
const bodyParser = require('body-parser')
const router= new express.Router()



// router.post('/blog', auth, async(req,res)=>{
//     const blog= new Blog(req.body)
//     try{
//         await blog.save()
//         res.status(201).send(blog)
//     }catch(e){
//         res.status(400).send(e)
//         console.log(e)
//     }
// })


router.post('/blog', auth, async(req,res)=>{
    const blog = new Blog({
        ...req.body,
        owner:req.user._id
    })
   
    try{
        await blog.save()
        res.status(201).send(blog)
        
    }catch(e){
        res.status(400).send(e)
        console.log(e)

    }
})


router.get('/blog', auth, async(req,res)=>{
    try{
        const blog= await Blog.find({owner: req.user._id})
        res.send(blog)   
    }catch(e){
        res.status(500).send(e)
    }
    
})

router.patch('/blog', auth, async(req,res)=>{
    const updates= Object.keys(req.body)
    const allowedUpdates=['Title', 'Description']
    const isValidOperations=updates.every((update)=> allowedUpdates.includes(update))

    if(!isValidOperations){
        return res.status(400).send({error: "Invalid Update"})
    }
    const _id=req.params._id
    try{
        const blog= await Blog.findByIdAndUpdate(_id)
        //const blog= await Blog.findByIdAndUpdate(_id, req.body, {new: true, runValidators:true}) //_id is requesting the params i.e the things that holds the paramter values, then req.body is whatever is written in the body is requested so that it is taken for updates, and { } are options but these are required
         if(!blog){
            return res.status(404).send()
            
        // updates.forEach((update)=> req.blog[update]=req.body[update]) //we are accesing every update on that user, we didnt use user.update bccz not supported like user[name]=req.body[name] is happening above
        //     await req.blog.save()

              }     res.send(req.blog)
            
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports=router