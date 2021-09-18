const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true
  },
  qty: {
    type: Number,
    required: true
  },
  done: {
    type: Boolean,
    required: false,
    default: false
  }
})

module.exports = mongoose.model('Todo', todoSchema)