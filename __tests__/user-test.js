const app = require('../src/app')
const path = require('path');
const request = require('supertest')
const User = require('../src/models/user-model')
const {userOneId, userOne, setupDatabase} = require('./fixtures/db');
const mongoose = require('mongoose')

beforeEach(setupDatabase)
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

test('Image Upload', async()=>{
    await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', path.resolve(__dirname, "fixtures/DSC_4657.jpg"))
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))                  
})


test("Should update valid user fields", async()=>{
    await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        name:"Mead"
    })
    .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toEqual("Mead")
})


test("Should not update invalid user fields", async()=>{
    await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        location:"Mumbai"
    })
    .expect(400)
})

afterAll(()=>{
    mongoose.connection.close();
});