const express = require('express')
const router = express.Router()
const Todo = require('../models/todoModel')



router.get('/', async(req, res) => {
  try{
    const todo = await Todo.find()
    res.json(todo)
  }catch(err) {
    res.send('Error ' + err)
  }
})


router.get('/:id', async(req, res) => {
  try{
    const todo = await Todo.findById(req.params.id)
    res.json(todo)
  }catch(err) {
    res.send('Error ' + err)
  }
})


router.post('/', async(req,res) => {
  let todo = await Todo.findOne({item:{ $regex: new RegExp("^" + req.body.item.trim().toLowerCase(), "i") }})
  if (todo) {
    todo.qty = todo.qty + req.body.qty
  } else {
    todo = new Todo({
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


router.delete('/', async(req, res) => {
  try{
    const todos = await Todo.find()
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