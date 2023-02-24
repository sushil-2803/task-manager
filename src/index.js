const express = require('express')
//import routes

const userRoutes= require('./router/user')
const taskRoutes= require('./router/task')


const app = express()

app.use(express.json())
const port = process.env.PORT
app.use(userRoutes)
app.use(taskRoutes)




app.get('/',(req,res)=>{
    res.send('Hello World')
})



app.listen(port,()=>{
    console.log(`Server is running at port ${port}`)
})