const express = require('express')
const router = new express.Router()
const Task = require('../models/task-model')
const taskModel = require('../models/task-model')
const auth = require('../middleware/auth')
/*
 * 
 * 
 * TASK Releated APIS
 *
 *  
 */




// creating new task

router.post('/tasks',auth,(req,res)=>{
    const task = new Task({
        ...req.body,
        owner:req.user._id
    })
    task.save()
    .then((result)=>{
        res.send(result)
    })
    .catch((err)=>{
        res.status(400).send(err)
    })

})



//  finding all task
// /tasks?completed=true
// pagination tasks?limit=10&skip=10
// /tasks?sortBy=createdAt:asc or /tasks?sortBy=createdBy:desc
router.get('/tasks',auth,async (req,res)=>{
    const match ={}
    const sort = {}
    if(req.query.completed){
        match.completed= req.query.completed ==='true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]]=parts[1]==='desc'? -1:1
    }
    if(req.query.completed)
    {
        const parts = req.query.completed.split(':')
        sort[parts[0]]= parts[1]==='true'? true:false
    }
    
    try{
        // const task =await Task.find({owner:req.user._id})
        await req.user.populate({
            path: 'tasks',
            match,
            // per documentation options need a default value
            options: {
              limit: parseInt(req.query.limit) || null,
              skip: parseInt(req.query.skip) || null,
              sort,
            },
          });
        res.status(200).send(req.user.tasks)

    }catch(e){
        res.status(500).send(e)
    }

})


// find task by ID

router.get('/tasks/:id', auth, async (req, res) => {
    let id = req.params.id
    try {
        // const task = await Task.findById(id)
        const task = await Task.findOne({_id:id,owner:req.user._id})
        if (!task) {
            return res.status(400).send('No task with this ID')
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }

})


//update task

router.patch('/tasks/:id',auth,async(req,res)=>{
    let _id= req.params.id
    try {
        const allowedUpdates=['discription','completed']
        const requestedUpdates= Object.keys(req.body)
        const isValid=requestedUpdates.every((element)=>{
            return allowedUpdates.includes(element)
        })
        if(!isValid)
        {
            return res.status(400).send('Invalid Update Parameter')
        }
        else{
            //const task = await Task.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})
            const task = await Task.findOne({_id,owner:req.user._id})
            
            if(!task)
            {
                return res.status(404).send('No task with this id')
            }
            else{
                requestedUpdates.forEach((element)=>{
                    task[element]=req.body[element]
                })
                await task.save()
                res.send(task)
            }
        }
    } catch (error) {
        res.status(500).send(error)
    }
})


//delete task

router.delete('/tasks/:id',auth, async (req, res) => {
    try {
        const _id = req.params.id
        const task = await Task.findOneAndDelete({_id,owner:req.user._id})
        if (task) {
            return res.send(task)
        } else {
            return res.status(400).send('No such TASK')
        }
    } catch (error) {
        res.status(500).send()
    }
})



module.exports=router