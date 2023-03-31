const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB)
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const Task = require('./task-model')
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number
    },
    email:{
        type:String,
        unique:true,
        required:true,
        validate(value){
            if(!validator.isEmail(value))
            {
                throw new Error('Invalid Email')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        validate(value){
            if(value.toLowerCase().includes('password'))
            {
                throw new Error('Invalid Password')
            }

        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps: true
})

// creating a virtual relation between two models or schema in mongoose

userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})


//middleware to hash password when created or updated
// using user=this as implentation takes place on user instance

userSchema.pre('save', async function(next){
    let user = this
    //isModified is used to check is the field is being modified
    if(user.isModified('password')){
        user.password= await bcrypt.hash(user.password,8)
    }
    next()
})

userSchema.pre('remove',async function(next){
    const user = this
    await Task.deleteMany({owner:user._id})
    next()
})

// defining custom method on user instance

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()
    delete userObject.tokens
    delete userObject.password

    return userObject
}

userSchema.methods.generateAuthToken= async function(){
    const user = this
    const token = jwt.sign({_id: user._id.toString()},process.env.jwt_code)    
    user.tokens =user.tokens.concat({token})
    await user.save()
    return token
}
// defining custom  statics on schema for whole collectoin

userSchema.statics.findByCredentials = async (email,passowrd)=>{
    const user = await userModel.findOne({email})
    // console.log(user)
    if(!user)
    {
        throw new Error("No email with user")
    }
    
    const isMatch = await bcrypt.compare(passowrd,user.password)
    if(!isMatch){
        throw new Error('Wrong password')
    }
        
    return user
}

const userModel = mongoose.model('User',userSchema)

module.exports=userModel