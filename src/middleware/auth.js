const jwt = require('jsonwebtoken')
const User = require('../models/user-model')

const auth = async (req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        // console.log(token)
        const decode = jwt.verify(token,process.env.jwt_code)
        // console.log(decode)
        const user = await User.findOne({_id:decode._id,'tokens.token':token})
        if(!user)
        {
            throw new Error('Login failed')
        }
        req.token =token
        req.user=user 
        next()
    }catch(e){
        res.status(401).send("Please login")
    }
}
module.exports=auth