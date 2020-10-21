import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: String,
    role: {   //1 = lecturer, 2 = student, 99 = admin
      type: Number,
      default: 2,
    }, 
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: String,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
