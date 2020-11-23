const mongoose= require('mongoose') //require mongoose 
const validator= require('validator')


//just the way mongodb is connected mongoose is also connected but the database name is given in the same line as url
mongoose.connect('mongodb://127.0.0.1:27017/test-project-api',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false
})


//creating instance of model
// const me= new User({
//     name: 'Vijeta',
//     email:'viju@gmail.com',
//     password:'helloo'
    
// })

//saving to db, the data is on me instance 
// me.save().then((result)=>{
//     console.log('Data successfully saved',me)
// }).catch((error)=>{
//     console.log('Error', error)
// })



//instace of task
// const mytask= new Task({
    
   
// })

// mytask.save().then((result)=>{
//     console.log('Task added successfully', mytask)
// }).catch((error)=>{
//     console.log('Error occured', error)
// })