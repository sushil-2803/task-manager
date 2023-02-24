const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const router = new express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user-model')
const {sendWelcomeEmail} = require('../email/email')
/*
 *
 * User Releated APIS
 * 
 */

// creating new user

router.post('/users', async(req,res)=>{
    const user  = new User(req.body)
    try{
        const result = await user.save()
        //sendWelcomeEmail(user.email,user.name)
        const token = await user.generateAuthToken()
        res.send({result,token})
    }catch(e){
        res.status(400).send(e)
    }

})


// login user

router.post('/users/login',async (req,res)=>{
    try{
        
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user,token})
    }catch(e)
    {
        res.status(400).send(e)
    }
})

//logout user

router.post('/users/logout', auth , async(req,res)=>{
    try{

        req.user.tokens=req.user.tokens.filter((token)=>{
           
            return token.token != req.token
        })
        await req.user.save()
        res.send()
    }catch(e)
    {
        res.status(500).send(e)
    }
})



//logout all sessions

router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens=[]
        req.user.save()
        res.send()
    }catch(e){
        res.status(500).send(e)
    }
})
// get your own profile
router.get('/users/me', auth, async(req,res)=>{
    res.send(req.user)
})


// get all users

router.get('/users',async (req,res)=>{
    try{
        const allUSers= await User.find({})
        res.status(201).send(allUSers)
    }catch(e){
        res.status(400).send(e)
    }
})


// get specific user 
// router.get('/users/:id',async(req,res)=>{
//     const _id = req.params.id

//     try{
//         const result = await User.findById(_id)
//         if(result)
//         {
//             return res.status(201).send(result)
//         }
//         return res.status(404).send("No user it this ID")
//     } catch (error) {
//         res.status(400).send(error)
        
//     }
// })

// update user details single user


// add user profile picture
const avatar = new multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(file.originalname.match('\.(jpg|png|jpeg)$'))
        {
            return cb(undefined,true)
        }
        else{
            return cb(new Error('Please upload image file'))
        }
    }
})
router.post('/users/me/avatar',auth,avatar.single('avatar'),async(req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.status(200).send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

//send user profile pic

router.get('/users/me/avatar',auth,async(req,res)=>{
    try{
        if(req.user.avatar===undefined)
        {
            throw new Error('No profile photo')
        }
        res.set('Content-type','image/jpg')
        res.send(req.user.avatar)
    }catch(e)
    {
        res.status(404).send(e)
    }
})

//delete user profile picture
router.delete('/users/me/avatar', auth , async(req,res)=>{
    try{
        req.user.avatar=undefined
        await req.user.save()
        res.send('OK')
    }catch(e){
        res.status(500).send(e)
    }
})




router.patch('/users/me', auth,async(req,res)=>{

    const allowedUpdates =['name',"email",'password','age']
    const requestedUpdates = Object.keys(req.body)

    const isValidUpdate = requestedUpdates.every((element)=>{
        return allowedUpdates.includes(element)
    })

    if (!isValidUpdate)
    {
        return res.status(400).send("INVALID Parammeters")
    }
    const _id = req.user._id
    try{


        //bypasses the middleware  
        //const user = await User.findByIdAndUpdate(_id,req.body,{new:true, runValidators:true})
        
        //getting user and saving value
        const user = await User.findById(_id)
        requestedUpdates.forEach((element)=>{
            user[element]=req.body[element]
        })
        await user.save()
        if(!user)
        {
            return res.status(404).send("NO Such User")
        }
        
        res.send(user)
    }catch(e){

        res.status(400).send(e)
    }
})

//delete user

router.delete('/users/me', auth, async(req,res)=>{
    try{
        req.user.remove()
        res.send(req.user)
    }
    catch(e){
        res.status(500).send(e)
    }
})

module.exports=router