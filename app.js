const express = require('express')
const mongoose = require('mongoose')
const url = 'mongodb://localhost/todoDb'

const app = express()

mongoose.connect(url)
const con = mongoose.connection

con.on('open', () => {
  console.log('connected')
})

app.use(express.json())

const todoRouter = require('./routers/todo')
app.use('/todo', todoRouter)

const userRouter = require('./routers/userApp')
app.use('/user', userRouter)

app.listen(8000, () => {
  console.log('server started')
})