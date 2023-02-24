
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.serect_key)
const sendWelcomeMail = (email,name)=>{
    console.log(email,name)  
    sgMail
        .send({
            to: email, // Change to your recipient
            from: 'mindflayer8286@gmail.com', // Change to your verified sender
            subject: 'Welcome to Task-Manager',
            text: `Welcome to Task-Manager ${name}`
          }).then(()=>{
            console.log('success')
          }).catch((e)=>{
            console.log(e)
          })
}
module.exports={
    sendWelcomeMail
}