const mongoose= require('mongoose') //require mongoose 
const validator= require('validator')// both these are needed here also
const bcrypt= require('bcryptjs')
const jwt= require('jsonwebtoken')


//when creating a model the object is passed to it i.e name,pw,gender,etc, so internally the mongoose takes the object and converts it to a schema.
const userSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        unique:true,
        required: true,
        trim: true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid email')
            }
        }
    },
    age:{
        type: Number,
        default:18

    },
    password:{
        type: String,
        required: true,
        minlength:7,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Choose another password')
            }
        }
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]
})

//to return only required details to the user
userSchema.methods.toJSON= function () {
    const user = this
    const userObject= user.toObject() //by mongoose and will return raw data

    delete userObject.password
    delete userObject.tokens

    return userObject
}

//auth-token
userSchema.methods.generateToken= async function () { //methods to be used on an indivisual user or instance.
    const user =this
    const token= jwt.sign({_id: user._id.toString()}, 'thisistrail') //converting the obj to string

    user.tokens= user.tokens.concat({ token })
    await user.save()

    return token //returned so to send as the result in login part
}

//for login
userSchema.statics.findByCredentials= async (email, password) => { //statics to be used on User model
    const user= await User.findOne({ email }) //finding by email
    if(!user){ //no user with email
        throw new Error('Invalid credentials')
    }
    const isMatch=await bcrypt.compare(password, user.password) //matching the password
    
    if(!isMatch){
        throw new Error("Invalid credentials")
    }
    return user //if verything is okay return the user and then go to user route
}



//hashing a passowrd
userSchema.pre('save', async function (next){
    const user=this
    if(user.isModified('password')){
        user.password= await bcrypt.hash(user.password,8) //over writing on palin text user password the hased password
    }
    next()
})

//creating a user model
const User= mongoose.model('User',userSchema)

module.exports=User //exporting the User model created to be used in index.js or other files