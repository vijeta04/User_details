const mongoose= require('mongoose') //require mongoose 
const validator= require('validator')// both these are needed here also


const profileSchema = new mongoose.Schema({
    FirstName:{
        type: String,
        required: true,
        trim: true
    },
    LastName:{
        type: String,
        required: true,
        trim: true
    },
    ContactNumber:{
        type: Number
    },
    Gender:{
        type:String,
        required:true
    },
    Age:{
        type: Number,
        default:18
    },
    Country:{
        type: String,
    },
    AboutYourSelf:{
        type: String,
        required: true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
    }
})
 


const Profile= mongoose.model('Profile',profileSchema)

module.exports= Profile


