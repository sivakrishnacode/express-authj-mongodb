import express, { json } from 'express'
import AuthJ from 'authj'
import cors from 'cors'

// utils
import { isAuth } from './Utils/Auth/Auth.js'
import User from './Utils/MongoDB/MongoDB.js'

const authj = AuthJ()
authj.config(process.env.JWTSECRETKEY)

const app = express()
app.use(json());
app.use(cors())


app.get('/userlist' , isAuth,  (req, res) => {
    res.json({message : `Hello ${ req.user.username }`})
})

app.post('/login' , async (req, res) => {
  console.log('login method');
  const username = req.query.username
  const password = req.query.password

  const user = await User.findOne({ username });

  if(!user){
    return res.status(401).json({ error: 'username not Found or incorrect' });
  } else if(password != user.password) {
    return res.status(401).json({ error: 'Password Incorrect' });
  }else{
    authj.signToken({username: user.username, password : user.password , userDetails: {emailaddress : user.emailaddress}})
    .then((responce) => {
        
        return res.status(200).json({ header : responce , message : 'Login Succesfully' });
    })
  }

  
})

app.post('/register', async (req, res) => {
    console.log('register method');
    const { username , password , emailaddress } = req.query

    const olduser = await User.findOne({username })
    if(olduser){
      res.status(404).send({
        error : 'username already exist'
      })
    }else{
      const user = new User({username: username, password : password, emailaddress : emailaddress})

      user.save()
      .then((responce) => {
          res.status(200)
          .send({
              message: `User ${responce.username} Register successfully`
          })
      })
    }
   
})

app.listen(3000, () => {
    console.log("Server on 3000 - ###########################");
})
