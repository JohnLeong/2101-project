import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import { jwtTokenSecret } from "../secret.js";

const router = express.Router();

//Route: POST ...url.../user/login
//Login using an email and password. Returns a JWT token if a valid email/password combination is given
router.route("/login").post((req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.status(400).json("Invalid username or password");
  }

  User.findOne({ email: email })
    .then((user) => {
      if (user == null) {
        res.status(400).json("Username or password incorrect");
      } else {
        //Check for correct password hash
        if (bcrypt.compareSync(password, user.passwordHash)) {
          // Generate an access token
          const accessToken = jwt.sign(
            {
              name: user.name,
              email: user.email,
              userId: user.id,
              role: user.role,
            },
            jwtTokenSecret
          );

          res.json({
            accessToken,
          });
        } else {
          res.status(400).json("Password incorrect");
        }
      }
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

/* Stuff below is for testing and reference purposes */

//Get all users
router.route("/").get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

//Get a user by id
router.route("/:id").get((req, res) => {
  User.findById(req.params.id)
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json("Error: " + err));
});

//Add a new user
router.route("/newlecturer").post((req, res) => {
  const name = req.body.name;
  const password = req.body.password;
  const email = req.body.email;
  const passwordHash = bcrypt.hashSync(password, 5);

  const newUser = new User({
    name: name,
    passwordHash: passwordHash,
    email: email,
    role: 1,
  });

  newUser
    .save()
    .then(() => res.json("User added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

//Delete a user by id
router.route("/:id").delete((req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.json("User deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

//Update an existing user by id
router.route("/:id").put((req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      user.username = req.body.username;

      user
        .save()
        .then(() => res.json("User updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});


/* DEBUGGING STUFF BELOW, PLEASE DONT CALL ANY OF THESE APIs */
const randomnames = [
  "Susannah Mcgibbon",
  "Jacinto Telford",
  "Claudie Dirksen",
  "Carletta Mccullough",
  "Pierre Hobson",
  "Carmela Callicoat",
  "Trish Raymond",
  "Enoch Bernat",
  "Daryl Vittetoe",
  "Bart Stjean",
  "Shayla Ruben",
  "Twanna Kirshner",
  "Melania Eurich",
  "Vida Treanor",
  "Charla Mattis",
  "Nena Kervin",
  "Cori Pulaski",
  "Madelene Dahl",
  "Norah Stufflebeam",
  "Burton Eisenmann",
  "Tracey Jacobs",
  "Pauletta Moeckel",
  "Ladonna Girardin",
  "Zachary Huard",
  "Carol Joe",
  "Josef Luckett",
  "Sebrina Prosper",
  "Janay Seigel",
  "Lesha Whitlock",
  "Evelynn Thorp",
  "Sun Claypool",
  "Shan Mcconville",
  "Roger Schroyer",
  "Delores Niemeyer",
  "Naoma Latham",
  "Marian Houghton",
  "Jin Mcpartland",
  "Carli Rau",
  "Maynard Gerber",
  "Virgilio Veith",
  "Rubie Maggard",
  "Rowena Huskey",
  "Anibal Mowry",
  "Jerilyn Saur",
  "Francesca Felmlee",
  "Dani Delucca",
  "Della Briere",
  "Johnny Herandez",
  "Joni Pendarvis",
  "Joelle Calvi",
  "Lucretia Flippo",
  "Linh Kleinman",
  "Glendora Garg",
  "Justa Madewell",
  "Babette Laliberte",
  "Katerine Cobbins",
  "Shari Bax",
  "Ester Kelley",
  "Ghislaine Grimmett",
  "Euna Finn",
  "Ingeborg Loewen",
  "Jules Shank",
  "Geoffrey Fenimore",
  "Moon Benevides",
  "Jacquiline Manville",
  "Sharyn Rankin",
  "Myles Putman",
  "Afton Sobol",
  "Stan Newson",
  "Natisha Sizelove",
  "Eufemia Heady",
  "Carolann Stultz",
  "Mertie Burrowes",
  "Patrica Bomberger",
  "Jonah Spaeth",
  "Penny Reider",
  "Darin Waddle",
  "Barbar Stengel",
  "Lemuel Chun",
  "Shani Santini",
];

const lecturerNames = [
  "Demetria Saur",
  "Juliann Tacy",
  "Laila Wanamaker",
  "Roscoe Agosta",
  "Thomasina Gazaway",
  "Enedina Roa",
  "Celestina Stiner",
  "Sherita Hansley",
  "Gerry Tuley",
  "Claudine Yelton",
];

//Mass add students(for testing)
router.route("/debug/massaddstudents").get((req, res) => {
  randomnames.forEach((item) => {
    const newUser = new User({
      name: item,
      passwordHash: bcrypt.hashSync("password123", 5),
      email: (item + "@sit.singaporetech.edu.sg")
        .replace(/\s/g, "")
        .toLowerCase(),
      role: 2,
    });

    newUser
      .save()
      .then(() => res.json("User added!"))
      .catch((err) => res.status(400).json("Error: " + err));
  });
});

//Mass add students(for testing)
router.route("/debug/massaddlecturer").get((req, res) => {
  const lecturers = [];
  lecturerNames.forEach((item) => {
    lecturers.push({
      name: item,
      passwordHash: bcrypt.hashSync("password123", 5),
      email: (item + "@sit.singaporetech.edu.sg")
        .replace(/\s/g, "")
        .toLowerCase(),
      role: 1,
    });
  });

  User.collection.insertMany(lecturers, function (err, docs) {
    if (err) {
      res.status(400).json("Error: " + err)
      return console.error(err);
    } else {
      res.json("Multiple documents inserted to Collection")
      console.log("Multiple documents inserted to Collection");
    }
  });
});

export default router;
