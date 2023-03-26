const app = require('./app')

app.get('/',(req,res)=>{
    res.send('Hello World')
})



app.listen(port,()=>{
    console.log(`Server is running at port ${port}`)
})