const mongoose= require('mongoose') //require mongoose 
const validator= require('validator')// both these are needed here also

const blogSchema= new mongoose.Schema({
    Title:{
        type: String,
        required:true,
        trim: true 
    },
    Description:{
        type: String,
        required:true,
        trim: true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
    }
    
})

const Blog= mongoose.model('Blog',blogSchema)

module.exports= Blog