const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user-model')
const Task = require('../../src/models/task-model')


const userOneId = new mongoose.Types.ObjectId()
const userOne={
    _id: userOneId,
    name:'Sushil',
    email:'sushil@gmail.com',
    password:'MyPass@2017',
    tokens:[{
        token: jwt.sign({_id:userOneId}, process.env.jwt_code)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo={
    _id: userTwoId,
    name:'Sunny',
    email:'sunny@gmail.com',
    password:'MyPass@2018',
    tokens:[{
        token: jwt.sign({_id:userTwoId}, process.env.jwt_code)
    }]
}

const taskOne={
    _id: new mongoose.Types.ObjectId(),
    discription:'First task',
    completed:false,
    owner:userOneId
}

const taskTwo={
    _id: new mongoose.Types.ObjectId(),
    discription:'Second task',
    completed:true,
    owner:userOneId
}

const taskThree={
    _id: new mongoose.Types.ObjectId(),
    discription:'Third task',
    completed:true,
    owner:userTwoId
}

const taskFour={
    _id: new mongoose.Types.ObjectId(),
    discription:'Fourth task',
    completed:false,
    owner:userTwoId
}

const setupDatabase= async()=>{
    await User.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await Task.deleteMany()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
    await new Task(taskFour).save()
}
module.exports={
    userOneId,
    userOne,
    setupDatabase,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    taskFour
}