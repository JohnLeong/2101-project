import express from "express";
import jwt from "jsonwebtoken";
import Module from "../models/module.js";
import Component from "../models/component.js";
import SubComponent from "../models/subcomponent.js";
import Comment from "../models/comment.js";
import { authenticateJWT } from "../authentication.js";
import ModuleClass from "../models/class.js";
import mongoose from "mongoose";
import User from "../models/user.js";

const router = express.Router();

//Route: GET ...url.../component/<componentId>
//Roles: Lecturer, Student
//Get a component by id
router
  .route("/:id")
  .all(authenticateJWT([1, 2]))
  .get((req, res) => {
    Component.findById(req.params.id)
      .select("-comments")
      .then((component) => res.json(component))
      .catch((err) => res.status(400).json("Error: " + err));
  });

router
  .route("/inmodule/:moduleid")
  .all(authenticateJWT([1, 2]))
  .get(async (req, res) => {
    const module = await Module.findById(req.params.moduleid).exec();

    //Find all components in the module
    const components = await Component.find({
      _id: { $in: module.components },
    })
      .populate("subcomponents")
      .exec();

    res.json(components);
  });

//Route: GET ...url.../component/lecturer/<componentId>
//Roles: Lecturer
//Lecturer class view
//List of students 
router
.route("/lecturer/:componentId")
.all(authenticateJWT([1]))
.get(async (req, res) => {
  try {
    //Find module
    const module = await Module.findOne({
      components: req.params.componentId,
    }).exec();

    //Find classes lecturer teaches
    const moduleClasses = await ModuleClass.find({
      _id: { $in: module.classes },
      lecturers: req.user.userId,
    }).populate("students").exec();



    //Find component, populate subcomponent
    const component = await Component.findById(req.params.componentId).populate("subcomponents").populate("comments").exec();

    //Calculate maximum marks
    let maximumMarks = 0;
    component.subcomponents.forEach((sc) => {
      maximumMarks += sc.weightage * 100;
    });

    //For each moduleClass, For each student, look through each subcomponent for their marks
    let studentResults = []
    moduleClasses.forEach((moduleClass) => {
      moduleClass.students.forEach((s) => {
        let subcomponentResults = [];
        let commentResults = [];
        let totalMarks = 0;
        let grade = 'F';

        //Look for subcomponent marks
        component.subcomponents.forEach((sc) => {
          const marks = sc.studentMarks.get(s._id.toString());
          if (typeof marks !== "undefined") {
            totalMarks += marks * sc.weightage;
            subcomponentResults.push({sc_id: sc._id, sc: sc.name, marks: marks});
          } else {
            subcomponentResults.push({sc_id: sc._id, sc: sc.name, marks: 0});
          }
        });

        //Calculate grade
        const marksPercentage = totalMarks / maximumMarks * 100;
        if (marksPercentage >= 84) grade = "A";
        else if (marksPercentage >= 67) grade = "B";
        else if (marksPercentage >= 57) grade = "C";
        else if (marksPercentage >= 47) grade = "D";
        else if (marksPercentage >= 37) grade = "E";
        else grade = "F";

        //Look for comments
        component.comments.forEach((c) => {
          if (c.studentId.toString() == s._id.toString()){
            commentResults.push(c);
          }
        });

        //studentID, classgroup,  name, grade, comment, subcomponent: [{sc_id: s_id, sc: s, marks: m}],
        studentResults.push({_id: s.id, studentID: s.email, classgroup: moduleClass.name, name: s.name, grade: grade, comments: commentResults, subcomponents: subcomponentResults});
      });
    });


    res.json(studentResults);

  } catch (err) {
    (err) => res.status(400).json("Error: " + err);
  }
});

//Route: GET ...url.../component/lecturer/grades/<componentId>
//Roles: Lecturer
//Gets the grades and standings of students in this lecturer's classes
router
  .route("/lecturer/grades/:classId")
  .all(authenticateJWT([1]))
  .get(async (req, res) => {
    try {
      //Find class lecturer teaches
      const moduleClass = await ModuleClass.findById(req.params.classId).exec();

      //Find module
      const module = await Module.findById(moduleClass.moduleId).exec();

      //Find all components in the module
      var temp = await Component.find({
        _id: { $in: module.components },
      }).exec();

      //Inform user if there are no components
      if (!temp) {
        res.json("No components in module");
        return;
      }

      var components = [];
      temp.forEach((item) => components.push(item.toObject()));

      //For each component, find their subcomponents
      for (var i = 0; i < components.length; ++i) {
        const subComponents = await SubComponent.find({
          _id: { $in: components[i].subcomponents },
        }).exec();

        components[i].subcomponents = subComponents;
      }

      //Loop through each class the lecturer teaches
      var results = [];

        //Find students in this class
        var students = await User.find({
          _id: { $in: moduleClass.students },
        }).exec();

        //For each student in class, calculate total marks
        var classMarks = new Map();
        var classResults = [];
        students.forEach((student) => {
          var totalMarks = 0;
          var studentResult = [];

          //Add up all the subcomponent marks in each component
          components.forEach((component) => {
            component.subcomponents.forEach((subcomponent) =>{
              const marks = subcomponent.studentMarks.get(student.id.toString());
              if (typeof marks !== "undefined") {
                totalMarks += marks * subcomponent.weightage;
              }
            });
          });

          //Calculate student grade
         // studentResult.push(student.name, student.email, 'A');

          if (classMarks.has(totalMarks)) {
            classMarks.get(totalMarks).push(student.id.toString());
          } else {
            classMarks.set(totalMarks, [student.id.toString()]);
          }
        });

        //Find maximum possible marks
        var maximumMarks = 0;
        components.forEach((component) => {
          component.subcomponents.forEach((subcomponent) =>{
            maximumMarks += 100 * subcomponent.weightage
          });
        });

        //Sort class marks
        var sortedMarks =  [...classMarks].sort((a, b) => a[0] < b[0] ? 1 : -1);

        //For each student in the class, calculate standing
        students.forEach((student) => {
          const standing = sortedMarks.findIndex((item) =>
            item[1].includes(student.id.toString())
          ) + 1;

          const marksPercentage = sortedMarks.find((item) =>
            item[1].includes(student.id.toString())
          )[0] / maximumMarks * 100;

          var grade;
          if (marksPercentage >= 84)
            grade = 'A';
          else if (marksPercentage >= 67)
            grade = 'B';
          else if (marksPercentage >= 57)
            grade = 'C';
          else if (marksPercentage >= 47)
            grade = 'D';
          else if (marksPercentage >= 37)
            grade = 'E';
          else
            grade = 'F';

          classResults.push([student.name, student.email, standing, grade]);
        });

      res.json({className: moduleClass.name, classId : moduleClass.id, results : classResults});

    } catch (err) {
      (err) => res.status(400).json("Error: " + err);
    }
  });

//Route: GET ...url.../component/lecturer/<componentId>/<studentId>
//Roles: Lecturer
//check if component isComplete based on componentId and studentId
router
  .route("/lecturer/:componentId/:studentId")
  .all(authenticateJWT([1]))
  .get((req, res) => {
    const studentId = req.params.studentId;
    //query component with subcomponents
    Component.findById(req.params.componentId)
    .populate("subcomponents")
    .exec()
    .then((component) => {
      //if no document returned
      if (!component) {
        res.status(400).json("Error: Invalid component id");
        return;
      }

      //check through each subcomponent
      let completeCount = 0;
      for (let index = 0; index < component["subcomponents"].length; ++index) {
        let boolFound = false;
        const studentMarks = component["subcomponents"][index]["studentMarks"];
        if (studentMarks != null) {
          //check through each subcomponent's studentMarks
          studentMarks.forEach(function (value, key) {
            if(key === studentId){
              boolFound = true;
            }
          })
          if(boolFound){
            ++completeCount;
          }
        }
      }
      //check if marks has been entered for all subcomponent
      if(completeCount === component["subcomponents"].length){
        //isComplete
        res.json(1);
      }
      else {
        //!isComplete
        res.json(0);
      }
    })
    .catch((err) => res.status(400).json("Error: " + err));
});


//Route: POST ...url.../component/new/<moduleId>
//Roles: Lecturer
//Add a new component
router
  .route("/new/:moduleId")
  .all(authenticateJWT([1]))
  .post(async (req, res) => {
    const name = req.body.name;
    const componentType = req.body.componentType;
    const weightage = req.body.weightage;

    const module = await Module.findById(req.params.moduleId).exec();
    if (!module) {
      res.status(400).json("Invalid module id");
      return;
    }

    const newComponent = new Component({
      name: name,
      componentType: componentType,
      weightage: weightage,
    });

    newComponent
      .save()
      .then(() => {
        module.components.push(newComponent.id);
        module.save().then(() => res.json("Component added!"));
      })
      .catch((err) => res.status(400).json("Error: " + err));
  });

//Route: PUT ...url.../component/<componentId>
//Roles: Lecturer
//Update a component by id
router
  .route("/:id")
  .all(authenticateJWT([1, 2]))
  .put((req, res) => {
    Component.findById(req.params.id)
      .then((component) => {
        component.name = req.body.name ?? component.name;
        component.componentType =
          req.body.componentType ?? component.componentType;
        component.weightage = req.body.weightage ?? component.weightage;

        component
          .save()
          .then(() => res.json("Component updated!"))
          .catch((err) => res.status(400).json("Error: " + err));
      })
      .catch((err) => res.status(400).json("Error: " + err));
  });

/* Stuff below is for testing and reference purposes */

//Get all components
router.route("/all").get((req, res) => {
  Component.find()
    .then((components) => res.json(components))
    .catch((err) => res.status(400).json("Error: " + err));
});

//Delete a component by id
router.route("/:id").delete((req, res) => {
  Component.findByIdAndDelete(req.params.id)
    .then(() => res.json("Component deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

/* DEBUGGING STUFF BELOW, PLEASE DONT CALL ANY OF THESE APIs */

//ADDS COMPONENTS TO EACH MODULE
// router.route("/debug/distributecomponents").post(async (req, res) => {
//   const numToAdd = 1;
//   try {
//     const modules = await Module.find().exec();

//     modules.forEach(async (module) => {
//       for (var i = 0; i < numToAdd; ++i) {
//         const newComponent = new Component({
//           name: "Final exam",
//           componentType: "Exam",
//           weightage: 30,
//         });
//         const result = await newComponent.save();
//         module.components.push(newComponent.id);
//         const result2 = await module.save();
//       }
//     });
//     res.json("DONE");
//   } catch (err) {
//     res.status(400).json("Error: " + err);
//   }
// });

// //test add subcomponent
// router.route("/debug/testingtest").post(async (req, res) => {
//   try {
//     const component = await Component.findById(
//       "5f8ed1b166ea0039a87b3bf3"
//     ).exec();

//     const newSubComponent = new SubComponent({
//       name: "Section A",
//       weightage: 30,
//       totalMarks: 50,
//       studentMarks: {
//         "5f8d342d9c0049499cbc86c7": 30,
//         "5f8d342d9c0049499cbc86d2": 20,
//         "5f8d342d9c0049499cbc86ff": 50,
//       },
//     });

//     await newSubComponent.save();

//     component.subcomponents.push(newSubComponent.id);
//     await component.save();
//     res.json("DONEE");
//   } catch (err) {
//     res.status(400).json("Error: " + err);
//   }
// });

// //test add comment
// router.route("/debug/commenttest").post(async (req, res) => {
//   try {
//     const component = await Component.findById(
//       "5f8ed1b166ea0039a87b3bf3"
//     ).exec();

//     const comment1 = new Comment({
//       commentType: true, //true = summative, false = formative
//       studentId: mongoose.Types.ObjectId("5f8d342d9c0049499cbc86c7"),
//       postedBy: mongoose.Types.ObjectId("5f8d341e9c0049499cbc86b8"),
//       body: "Hello, this is a test summative comment",
//       datePosted: Date.now(),
//     });
//     const comment2 = new Comment({
//       commentType: false, //true = summative, false = formative
//       studentId: mongoose.Types.ObjectId("5f8d342d9c0049499cbc86c7"),
//       postedBy: mongoose.Types.ObjectId("5f8d341e9c0049499cbc86b8"),
//       body: "Hello, this is a test formative comment. hihihiihihihiih",
//       datePosted: Date.now(),
//     });

//     await comment1.save();
//     await comment2.save();
//     component.comments.push(comment1.id);
//     component.comments.push(comment2.id);
//     await component.save();

//     res.json("DONEE");
//   } catch (err) {
//     res.status(400).json("Error: " + err);
//   }
// });

// router
// .route("/addstudentid/adding")
// .get(async (req, res) => {
//   const students = await User.find({role: 2}).exec();
//   students.forEach(async (s) => {
//     console.log(s.id);
//     await User.updateMany({ _id: s.id }, { studentId: 1900000 }).exec();
//   });

//   res.json(students.length);
// });

export default router;
