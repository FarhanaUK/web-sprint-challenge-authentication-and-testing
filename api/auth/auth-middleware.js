const Users = require('./auth-model')
const bcrypt = require('bcryptjs')


async function checkUserNameExists(req, res, next) {
  try {
    const user = await Users.findBy({ username: req.body.username });
    if (!user.length) {
      next();
    } else {
      next({ status: 401, message: "username taken" });
    }
  } catch (err) {
    next(err);
  }
}

const validateRequestBody = (req, res, next) => {
  try {
    const { password, username } = req.body;
    if (!password || !username) {
      next({ status: 400, message: "username and password required" });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}


const hashPassword = (req, res, next) => {

const {username, password } = req.body
const hash = bcrypt.hashSync(password, 8)
console.log("Hashed password: ", hash);

  Users.add({ username, password: hash })
    .then(saved => {
      req.user = { 
        id: saved.id, 
        username: saved.username, 
        password: hash 
      };
      
      next();  
    })
    .catch(next);  
};


async function validateUser(req, res, next) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      next({ status: 400, message: "username and password required" });
    }
    const user = await Users.findBy({username})
    if(user.length === 0 )
        return next({status: 401, message: "Invalid Credentials"})
    req.user = user[0]
    next();
  } catch (err) {
    next(err);
  }
}


 /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */







module.exports ={
    checkUserNameExists,
    validateRequestBody,
    hashPassword,
    validateUser
}