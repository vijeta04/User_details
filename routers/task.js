const express= require('express')
const Task= require('../models/task')
const auth= require('../middleware/authentication')
const app=express()

const router= new express.Router()

router.post('/tasks',auth,async (req,res)=>{
    //const task= new Task(req.body)
    const task= new Task({                  
        ...req.body,                    //... spread operator it will copy everything of body, and the owner id is hard coded
        owner:req.user._id
    })

    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }


    // const task=new Task(req.body)
    // task.save().then(()=>{
    //     res.send(task)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // })
})

//fetch all task
router.get('/tasks',async (req,res)=>{

    try{
        const tasks= await Task.find({})
        res.send(tasks)
    }catch(e){
        res.status(500).send(e)
    }


    // Task.find({}).then((tasks)=>{
    //     res.send(tasks)
    // }).catch((e)=>{
    //     res.status(500).send(e)
    // })
})

//fetching a task by id
router.get('/tasks/:id',async (req,res)=>{
    const _id= req.params.id
    try{
        const task= await Task.findById(_id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }

    // console.log(req.params)
    // const _id=req.params.id
    // Task.findById(_id).then((task)=>{
    //     if(!task){
    //         return res.status(404).send()
    //     }
    //     res.send(task)
    // }).catch((error)=>{
    //     res.status(500).send(error)
    // })
})

//updating a task
router.patch('/tasks/:id', async(req,res)=>{
    const updates= Object.keys(req.body)
    const allowedUpdates=['description','completed']
    const isValidOperations=updates.every((update)=> allowedUpdates.includes(update))

    if(!isValidOperations){
        return res.status(400).send({error: 'Invalid updates!'})
    }
    const _id=req.params.id
    try{    
        const task=await Task.findByIdAndUpdate(_id)
        updates.forEach((update)=>task[update]=req.body[update])
        await task.save()
        //const task= await Task.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})


//deleting a task by id
router.delete('/tasks/:id', async(req,res)=>{
    try{
        const task= await Task.findByIdAndDelete(req.params.id)
        if(!task){
            res.status(404).send()
        }
        res.status(200).send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports=router