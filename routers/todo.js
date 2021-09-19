const express = require('express')
const router = express.Router()
const Todo = require('../models/todoModel')


// Get all the Task added by the logged-in user
// request param: http://127.0.0.1:8000/todo/abc@xxx.com 
router.get('/:email', async(req, res) => {
  try{
    const todo = await Todo.find({email: req.params.email})
    res.json(todo)
  }catch(err) {
    res.send('Error ' + err)
  }
})


// Add a Task or if task already exists update qty by the logged-in user
// request body: {{
//     "email": "abc@xxx.com",
//     "item": "task",
//     "qty": 1,
//     "done": false
// }}
router.post('/', async(req,res) => {
  let todo = await Todo.findOne({
    item:{ $regex: new RegExp("^" + req.body.item.trim().toLowerCase(), "i") },
    email: req.body.email
  })
  if (todo) {
    todo.qty = todo.qty + req.body.qty
  } else {
    todo = new Todo({
      email: req.body.email.trim().toLowerCase(),
      item: req.body.item.trim().toLowerCase(),
      qty: req.body.qty,
      done: req.body.done
  })}

  try{
    const dbRes = await todo.save()
    res.json(dbRes)
  }catch(err){
    res.send('Error ' + err)
  }
})


// Mark as done or undone by the logged-in user
// request param: http://127.0.0.1:8000/todo/taskId
router.patch('/:id', async(req, res) => {
    const todo = await Todo.findById(req.params.id)
    if (todo != null) {
      todo.done = ! todo.done
    } else {res.json('Task not found')}

    try{
      const dbRes = await todo.save()
      res.json(dbRes)
    }catch(err){
      res.send('Error ' + err)
    }
})


// Delete a Task by id by a logged-in user
// request param: http://127.0.0.1:8000/todo/taskId
router.delete('/:id', async(req, res) => {
  try{
    const todo = await Todo.findById(req.params.id)
    if (todo != null) {
      const dbRes = await todo.delete()
      res.json("deleted one task")
    }
    res.json("Task not present")
  }catch(err) {
    res.send('Error ' + err)
  }
})


// Delete all the Tasks for a logged-in user
// request param: http://127.0.0.1:8000/todo/
router.delete('/', async(req, res) => {
  try{
    const todos = await Todo.find({email: req.body.email})
    if (todos.length > 0) {
      for (let todo of todos) {
        const dbRes = await todo.delete()
      }
      res.json("deleted all tasks")
    }
    res.json("Nothing to clear")
  }catch(err) {
    res.json('Error ' + err)
  }
})


module.exports = router