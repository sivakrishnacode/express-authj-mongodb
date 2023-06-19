import { connect, Schema, model } from 'mongoose'

// connect mongodb
connect(process.env.MONGODBURL , { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect : MongoDB:', err));


// Define the User schema
const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    emailaddress : { type: String, required: true }
});
  
const User = model('UserList', userSchema);

export default User