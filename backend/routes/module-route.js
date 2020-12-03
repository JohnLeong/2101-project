import express from "express";
import Module from "../models/module.js";
import ModuleClass from "../models/class.js";
import SubComponent from "../models/subcomponent.js";
import Comment from "../models/comment.js";
import Component from "../models/component.js";
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

//Route: GET ...url.../module/student/<moduleId>
//Roles: Student
//Gets all components details in a module for a student
router
  .route("/student/:moduleId")
  .all(authenticateJWT([2]))
  .get(async (req, res) => {
    try {
      //Find module
      const module = await Module.findById(req.params.moduleId).exec();

      //Find class student is in
      const moduleClass = await ModuleClass.findOne({
        _id: { $in: module.classes },
        students: req.user.userId,
      }).exec();

      //Find all components in the module
      const components = await Component.find({
        _id: { $in: module.components },
      }).populate("subcomponents").exec();

      //Inform user if there are no components
      if (!components) {
        res.json("No components in module");
        return;
      }

      //Retrieve comments in the components for this student
      var componentObjects = [];
      for (var i = 0; i < components.length; ++i) {
        const comments = await Comment.find({
          _id: { $in: components[i].comments },
          studentId: req.user.userId,
        }).exec();

        var summativeComments = [];
        var formativeComments = [];

        //Check comments and split into summative and formative based on commentType
        comments.forEach((element) => {
          if (element.commentType == true) {
            summativeComments.push(element);
          } else {
            formativeComments.push(element);
          }
        });

        //Get subcomponents in this component
        const subComponents = components[i].subcomponents;

        var classMarks = new Map();
        moduleClass.students.forEach((studentId) => {
          var totalMarks = 0;

          //Add up all the subcomponent marks
          subComponents.forEach((subcomponent) => {
            const marks = subcomponent.studentMarks.get(studentId.toString());
            if (typeof marks !== "undefined") {
              totalMarks += marks * subcomponent.weightage;
            }
          });

          //classMarks.set(totalMarks, [studentId.toString()]);
          if (classMarks.has(totalMarks)) {
            classMarks.get(totalMarks).push(studentId.toString());
          } else {
            classMarks.set(totalMarks, [studentId.toString()]);
          }
        });

        var componentObject = components[i].toObject();

        //Standing
        var sortedArray =  [...classMarks].sort((a, b) => a[0] < b[0] ? 1 : -1);
        const indexPosition = sortedArray.findIndex((item) => item[1].includes(req.user.userId));

        if (indexPosition == -1 || sortedArray.length < 2){
          componentObject.standingPercentile = 100;
        } else {
          componentObject.standingPercentile = ((indexPosition) / moduleClass.students.length) * 100;
        }

        //Subcomponents
        componentObject.subcomponents = [];
        subComponents.forEach((subcomponent) => {
          var subcomponentObject = subcomponent.toObject();
          delete subcomponentObject.studentMarks;
          subcomponentObject.marks = subcomponent.studentMarks.get(req.user.userId);
          componentObject.subcomponents.push(subcomponentObject);
        });

        componentObject.summativeComments = summativeComments;
        componentObject.formativeComments = formativeComments;
        componentObject.numClassStudents = moduleClass.students.length;

        delete componentObject.comments;

        componentObjects.push(componentObject);
      }

      //Return components
      res.json(componentObjects);
    } catch (err) {
      (err) => res.status(400).json("Error: " + err);
    }
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
    .populate("classes")
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
