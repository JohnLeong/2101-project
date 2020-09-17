import express from 'express';
import User from '../models/user.js';

const router = express.Router();

router.route('/').get((req, res) => {
  const test = {hi: "Hello"};
  res.json(test);
});

router.route('/helloworld').get((req, res) => {
  res.send("hellooooo");
});

router.route('/add').get((req, res) => {
  const newUser = new User({username: "Hello"});

  newUser.save()
    .then(() => res.json('User added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

export default router;