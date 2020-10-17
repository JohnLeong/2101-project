import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  role: Number,   //1 = lecturer, 2 = student, 99 = admin
  email: String,
  passwordHash: String,
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

export default User;