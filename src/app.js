const express = require('express')
//import routes

const userRoutes= require('./router/user')
const taskRoutes= require('./router/task')


const app = express()

app.use(express.json())

app.use(userRoutes)
app.use(taskRoutes)




app.get('/',(req,res)=>{
    res.send('Hello World')
})



module.exports=app