const mongoose= require('mongoose') //require mongoose 
const validator= require('validator')

const Task= mongoose.model('Task',{         //Task written in bracket is the task name while the const Task is a variable to store the model Task
    description:{
        type: String,
        required: true,
        trim: true
    },
    completed:{
        type:Boolean,
        default: false
    },
    owner:{                                     //to add that this profie/task has been created by a user, and their id will be stored in the owner obj using mongoose functions
        type: mongoose.Schema.Types.ObjectId,   //data stored by the owner has to be an object id.
        required: true
    }
})

module.exports=Task