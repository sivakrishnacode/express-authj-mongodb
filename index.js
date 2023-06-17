const express = require('express')
const AuthJ = require('authj')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config()
const authj = AuthJ()
authj.config(process.env.JWTSECRETKEY)

const app = express()
app.use(express.json());
app.use(cors())


mongoose.connect(process.env.MONGODBURL , { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect : MongoDB:', err));

// Define the User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  emailaddress : { type: String, required: true }
});

const User = mongoose.model('UserList', userSchema);

function isAuth(req, res, next){
    console.log(req.headers.token);

    authj.checkToken({token: req.headers.token })
    .then((res) => {
       
        req.user = res
        next()
    }).catch((err) => {
        return res.status(401).json({ error: err });
    })
   
}

app.get('/userlist' , isAuth,  (req, res) => {
    console.log(req.user, 'user details');
    res.json({message : 'successfully'})
})


app.post('/login' , async (req, res) => {
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

app.post('/register', (req, res) => {
    console.log('login method');
    const { username , password , emailaddress } = req.query
    const user = new User({username: username, password : password, emailaddress : emailaddress})

    user.save()
    .then((responce) => {
        res.status(200)
        .send({
            message: `User ${responce.username} Register successfully`
        })
    })
})



app.listen(3000, () => {
    console.log("Server on 3000 - ###########################");
})
