const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task-model')
const {userOneId, 
    userOne, 
    setupDatabase,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    taskFour
    } = require('./fixtures/db')
const mongoose = require('mongoose')

beforeEach(setupDatabase)

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            discription: 'From my test'
        })
        .expect(200)
    const task = Task.findOne({_id:response.body._id,owner:userOneId})
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(undefined)
})
test('Should get all tasks for user', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toEqual(2)
    expect(response.body[0].owner).toEqual(userOneId.toString())
    expect(response.body[1].owner).toEqual(userOneId.toString())
    expect(response.body[0].completed).toEqual(false)
    expect(response.body[1].completed).toEqual(true)
    expect(response.body[0].discription).toEqual('First task')
    expect(response.body[1].discription).toEqual('Second task')
})
test('Should not delete other users tasks', async () => {
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(400)
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
    expect(task.discription).toEqual('First task')
})
afterAll(()=>{
    mongoose.connection.close();
});
