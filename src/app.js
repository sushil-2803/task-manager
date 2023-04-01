const express = require('express')
//import routes

const userRoutes= require('./router/user')
const taskRoutes= require('./router/task')

port=process.env.PORT||3000
const app = express()

app.use(express.json())

app.use(userRoutes)
app.use(taskRoutes)




app.get('/',(req,res)=>{
    res.send('<h1> Welcome To Task Manager API </h1> <br> <h2> Please use Postman API tool and  /users or /tasks routes to access the API </h2> <br> <h3> Thank You </h3> <h4> By: Sushil Dubey </h4>')
})



module.exports=app