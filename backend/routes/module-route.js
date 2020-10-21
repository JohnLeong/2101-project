import express from "express";
import Module from "../models/module.js";
import ModuleClass from "../models/class.js";
import User from "../models/user.js";
import { authenticateJWT } from "../authentication.js";

const router = express.Router();

//Route: GET ...url.../module/usermodules
//Gets the enrolled modules for the user specified in the jwt token
router
  .route("/usermodules")
  .all(authenticateJWT([1, 2]))
  .get((req, res) => {
    //Find all modules the user is enrolled in
    Module.find({ users: req.user.userId })
      .select("-users")
      .then((modules) => {
        //modules.forEach((item, i) => console.log(modules[i].users))
        res.json(modules);
      })
      .catch((err) => res.status(400).json("Error: " + err));
  });

/* Stuff below is for testing and reference purposes */

//Add user to module
router.route("/adduser/").post(async (req, res) => {
  if (!req.body.classId || !req.body.userId) {
    res.status(400).json("moduleId, classId, userId are required");
    return;
  }

  //Find user
  const user = await User.findById(req.body.userId).exec();
  if (!user) {
    res.status(400).json("Invalid user id");
    return;
  }

  //Find class
  const moduleClass = await ModuleClass.findById(req.body.classId).exec();
  if (!moduleClass) {
    res.status(400).json("Invalid module class id");
    return;
  }

  //Find module
  const module = await Module.findById(moduleClass.moduleId).exec();
  if (!module) {
    res.status(400).json("Invalid module id");
    return;
  }

  if (
    moduleClass.lecturers.includes(req.body.userId) ||
    moduleClass.students.includes(req.body.userId)
  ) {
    res.status(400).json("User is already enrolled in the class");
    return;
  }

  if (user.role == 1) moduleClass.lecturers.push(user.id);
  else if (user.role == 2) moduleClass.students.push(user.id);

  moduleClass
    .save()
    .then(() => {
      if (!module.users.includes(req.body.userId)) {
        module.users.push(user.id);
        module
          .save()
          .then(() => res.json("Module updated!"))
          .catch((err) => res.status(400).json("Error: " + err));
      }
      res.json("Updated");
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

//Get all modules
router.route("/all").get((req, res) => {
  Module.find()
    .then((modules) => res.json(modules))
    .catch((err) => res.status(400).json("Error: " + err));
});

//Get a module by id
router.route("/:id").get((req, res) => {
  Module.findById(req.params.id)
    .then((module) => res.json(module))
    .catch((err) => res.status(400).json("Error: " + err));
});

//Add a new module
router.route("/").post((req, res) => {
  const name = req.body.name;
  const description = req.body.description;

  const newModule = new Module({
    name: name,
    description: description,
  });

  newModule
    .save()
    .then(() => res.json("Module added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

//Delete a module by id
router.route("/:id").delete((req, res) => {
  Module.findByIdAndDelete(req.params.id)
    .then(() => res.json("Module deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

//Update an existing module by id
router.route("/:id").put((req, res) => {
  Module.findById(req.params.id)
    .then((module) => {
      module.name = req.body.name;
      module.description = req.body.description;

      module
        .save()
        .then(() => res.json("Module updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

/* DEBUGGING STUFF BELOW, PLEASE DONT CALL ANY OF THESE APIs */

//Distribute students among all modules
router.route("/debug/distributestudents").post(async (req, res) => {
  try {
    //Get all students
    const users = await User.find({role: 2}).exec();
    const modules = await Module.find().exec();
    const moduleClasses =  await ModuleClass.find().exec();

    //modules.forEach(async (item) => {item.users = []; await item.save();})
    //moduleClasses.forEach(async (item) => {item.students = []; await item.save();})

    var moduleCounter = 0;
    var classCounter = 0;


    users.forEach(async (user) => {

      for (var i = 0; i < 3; ++i) {
        //Add user to module
        const module = modules[moduleCounter];

        for (var j = 0; j < 1; ++j) {
          const moduleClass = moduleClasses.find((item) => item.id == module.classes[classCounter]);
          moduleClass.students.push(user.id);
          //await moduleClass.save();

          classCounter = (classCounter + 1) % module.classes.length;
        }

        module.users.push(user.id);

        //console.log(module.id);
        moduleCounter = (moduleCounter + 1) % modules.length;
      }
    });

    modules.forEach(async (item) => await item.save());
    moduleClasses.forEach(async (item) => await item.save());

    res.json("DONE");
  } catch (err) {}
});

//Distribute lecturers among all modules
router.route("/debug/distributelecturers").post(async (req, res) => {
  try {
    //Get all students
    const users = await User.find({role: 1}).exec();
    const modules = await Module.find().exec();
    const moduleClasses =  await ModuleClass.find().exec();

    //modules.forEach(async (item) => {item.users = []; await item.save();})
    //moduleClasses.forEach(async (item) => {item.students = []; await item.save();})

    var moduleCounter = 0;
    var classCounter = 0;


    users.forEach(async (user) => {

      for (var i = 0; i < 3; ++i) {
        //Add user to module
        const module = modules[moduleCounter];

        for (var j = 0; j < 2; ++j) {
          const moduleClass = moduleClasses.find((item) => item.id == module.classes[classCounter]);
          moduleClass.lecturers.push(user.id);
          //await moduleClass.save();

          classCounter = (classCounter + 1) % module.classes.length;
        }

        module.users.push(user.id);

        //console.log(module.id);
        moduleCounter = (moduleCounter + 1) % modules.length;
      }
    });

    modules.forEach(async (item) => await item.save());
    moduleClasses.forEach(async (item) => await item.save());

    res.json("DONE");
  } catch (err) {}
});

//CLEARS ALL USERS FROM ALL MODULES AND CLASSES
router.route("/debug/clearclassandmodule").delete(async (req, res) => {
  try {
    //Get all students
    const users = await User.find({role: 1}).exec();
    const modules = await Module.find().exec();
    const moduleClasses =  await ModuleClass.find().exec();

    modules.forEach(async (item) => {item.users = []; await item.save();})
    moduleClasses.forEach(async (item) => {item.students = []; await item.save();})

    res.json("DONE");
  } catch (err) {}
});

export default router;
