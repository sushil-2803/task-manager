const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB)
mongoose.set('strictQuery', false)

const taskSchema = new mongoose.Schema({
    discription:{
        type:String,
        required:true,
        minlength:2
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
},{
    timestamps:true
})

const taskModel = mongoose.model('Task',taskSchema)

const t = new taskModel({
    "discription":"Learn Nodejs",
    "completed":true
})

module.exports=taskModel