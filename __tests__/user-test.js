const app = require('../src/app')
const request = require('supertest')
const User = require('../src/models/user-model')
const  mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

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

beforeEach(async()=>{
    await User.deleteMany()
    await new User(userOne).save()
})

test('Create New User',async ()=>{
    await request(app).post('/users').send({
        name:"Sushil",
        email:"su356shil@gmail.com",
        password:"Sushil@123"
    }).expect(200)
})

test('Should Login a User',async()=>{
    await request(app).post('/users/login').send({
        email:userOne.email,
        password:userOne.password
    }).expect(200)
})

test('Should NOT login a User',async()=>{
    await request(app).post('/users/login').send({
        email:userOne.email,
        password:"ABC"
    }).expect(400)
})

test("Should Get user profile", async()=>{
    await request(app).
    get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test("Should not get profile for unauhtenticated user", async()=>{
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test("Should delete user account",async()=>{
    await request(app)
    .delete('/users/me')
    .set("Authorization",`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test("Should not delete unauthenticated user account",async()=>{
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

afterAll(done => {
    mongoose.connection.close();
    done();
});