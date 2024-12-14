const router = require('express').Router();
const { checkUserNameExists,
  validateRequestBody,
  hashPassword, 
  validateUser } = require('./auth-middleware')



const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../secrets')
const bcrypt = require('bcryptjs')

router.post('/register', checkUserNameExists, validateRequestBody,
  hashPassword, (req, res) => {
    const { id, username, password } = req.user; 
   res.status(201).json({
      id,
      username,
      password  
    });
  });

router.post("/login", validateUser, (req, res, next) => {
  
  if(bcrypt.compareSync(req.body.password, req.user.password)){
    const token = buildToken(req.user)
    res.json({
      message: `${req.user.username} is back`, token
    })
      }else{
        next({status: 401, message: "invalid credentials"})
      }
    });
    
    function buildToken(user) {
      const payload = {
        id: user.id,
        username: user.username,
      }
    
      const options = {
        expiresIn: '1d',
      }
      return jwt.sign(payload, JWT_SECRET, options)
    }


module.exports = router;
