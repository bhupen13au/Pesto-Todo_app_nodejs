const express = require('express')
const router = express.Router()
const User = require('../models/userModel')
const Bcrypt = require("bcryptjs");



// User signup
// request body: {
//     "email": "xyz@xxx.com",
//     "pwd": "xxxx",
//     "pwdConfirm": "xxxx"
// }
router.post('/signup', async(req,res) => {
  let user = await User.findOne({email:{ $regex: new RegExp("^" + req.body.email.trim().toLowerCase(), "i") }})
  if (user) {
    res.send('Already have an account')
  } else if (req.body.pwd !== req.body.pwdConfirm) {
    res.send('Password not matching')
  } else {
    user = new User({
      email: req.body.email.trim().toLowerCase(),
      pwd: Bcrypt.hashSync(req.body.pwd, 10)
  })}

  try{
    const dbRes = await user.save()
    res.send('User saved successfuly')
  }catch(err){
    res.send('Error ' + err)
  }
})


// User login
// request body: {
//     "email": "xyz@xxx.com",
//     "pwd": "xxxx",
// }
router.post('/signin', async(req,res) => {
  let user = await User.findOne({email:{ $regex: new RegExp("^" + req.body.email.trim().toLowerCase(), "i") }})
  if (user) {
    if (Bcrypt.compareSync(req.body.pwd, user.pwd)) {
      res.json(true)
    } else {
      res.send('Invalid login details')
    }
  } else {
    res.send('Invalid login details')  
  }

  try{
    const dbRes = await todo.save()
    res.json(dbRes)
  }catch(err){
    res.send('Error ' + err)
  }
})


module.exports = router