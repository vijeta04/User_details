const jwt= require('jsonwebtoken') //to validate the token being provided
const User=require('../models/user') //bcz the token section resides in the User model
const auth= async(req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ', '') //to get value of header i.e the token we have given in header by use of request, nd the name of the header i.e Authoriztion here; by using replace we are replacing the bearer just to get the jwt from token(bearer removed)
        console.log(token)
         const decoded= jwt.verify(token, 'thisistrail') //this is done to make sure that the token was created by our server & has not expired; confirming it by use of spl letters as done in user model
            //if the decoded is true i.e such a token exists then we will find the
          const user= await User.findOne({ _id: decoded._id, 'tokens.token':token})// decoded has _id property, adn we are checking if the token given is still a part of the tokens array in the model, if user logs out then the token is deleted from the array.
        if(!user){
            throw new Error()
        }
        req.token=token // jo token abhi session me use me h usko target kiya jaa rha h taki like phone se login to bs phone se delete ho 
        req.user=user // here req.user is requesting user which has the authentication token.
        next()
    }catch(e){
        res.status(401).send({ error: 'Please authenticate'})
        // console.log(error)
    }
}


module.exports=auth //to be used somewhere else,hence being exported