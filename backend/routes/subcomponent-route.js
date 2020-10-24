import express from "express";
import jwt from "jsonwebtoken";
import Module from "../models/module.js";
import Component from "../models/component.js";
import Subcomponent from "../models/subcomponent.js";
import Comment from "../models/comment.js";
import { authenticateJWT } from "../authentication.js";
import ModuleClass from "../models/class.js";
import mongoose from "mongoose";
import User from "../models/user.js";

const router = express.Router();

/* ----------------------- for debugging ------------------------- */
//Get all subcomponents
router.route("/all").get((req, res) => {
    Subcomponent.find()
      .then((subcomponents) => res.json(subcomponents))
      .catch((err) => res.status(400).json("Error: " + err));
  });

/* --------------------------------------------------------------- */

//Route: GET ...url.../subcomponent/<subcomponentId>
//Roles: Lecturer, Student
//Get a subcomponent by id
router
    .route("/:id")
    .all(authenticateJWT([1, 2]))
    .get((req, res) => {
        Subcomponent.findById(req.params.id)
        .then((subcomponent) => res.json(subcomponent))
        .catch((err) => res.status(400).json("Error: " + err));
    });

//Route: POST ...url.../subcomponent/new/<componentId>
//Roles: Lecturer
//Add a new subcomponent to a component
router
  .route("/new/:componentId")
  .all(authenticateJWT([1]))
  .post(async (req, res) => {
    const name = req.body.name;
    const weightage = req.body.weightage;
    const totalMarks = req.body.totalMarks;

    const component = await Component.findById(req.params.componentId).exec();
    if (!component) {
      res.status(400).json("Invalid component id");
      return;
    }

    const newSubcomponent = new Subcomponent({
      name: name,
      weightage: weightage,
      totalMarks: totalMarks
    });

    newSubcomponent
      .save()
      .then(() => {
        component.subcomponents.push(newSubcomponent.id);
        component.save().then(() => res.json("Subcomponent added!"));
      })
      .catch((err) => res.status(400).json("Error: " + err));
  });

//Route: PUT ...url.../subcomponent/<subcomponentId>
//Roles: Lecturer
//edit a subcomponent by id
router
  .route("/:id")
  .all(authenticateJWT([1]))
  .put((req, res) => {
    Subcomponent.findById(req.params.id)
      .then((Subcomponent) => {
        Subcomponent.name = req.body.name ?? Subcomponent.name;
        Subcomponent.weightage = req.body.weightage ?? Subcomponent.weightage;
        Subcomponent.totalMarks = req.body.totalMarks ?? Subcomponent.totalMarks;

        Subcomponent
          .save()
          .then(() => res.json("Subcomponent updated!"))
          .catch((err) => res.status(400).json("Error: " + err));
      })
      .catch((err) => res.status(400).json("Error: " + err));
  });

//Route: put ...url.../subcomponent/new/studentmarks/<subcomponentId>
//Roles: Lecturer
//Add subcomponent marks for group of students 
//Input para: subcomponent id
//Input json: maps{user(student)objectid: marks}
router
  .route("/new/studentmarks/:subcomponentId")
  .all(authenticateJWT([1]))
  .put((req, res) => {
    Subcomponent.findById(req.params.subcomponentId)
        .then((Subcomponent) => {
            //student marks from db
            const storedStudentMarks = Subcomponent.studentMarks;
            var storedMap = new Map();
            
            //add to storedMap
            if(storedStudentMarks!=null){
                storedStudentMarks.forEach(function(value,key){
                    storedMap.set(key, value);
                })
            }

            //new student marks map
            const studentMarks = req.body.studentMarks;            
            //add to storedMap
            if(studentMarks!=null){
                for(var newValue in studentMarks){
                    storedMap.set(newValue, studentMarks[newValue]);
                }
            }

            //update to db
            Subcomponent.studentMarks = storedMap ?? Subcomponent.studentMarks;

            Subcomponent
            .save()
            .then(() => res.json("student Marks added!"))
            .catch((err) => res.status(400).json("Error: " + err));
        })
        .catch((err) => res.status(400).json("Error: " + err));
    });

    

//Route: put ...url.../subcomponent/edit/studentmarks/<subcomponentId>
//Roles: Lecturer
//add or edit subcomponent marks for group of students 
//Input para: subcomponent id
//Input json: maps{user(student)objectid: marks}
router
  .route("/edit/studentmarks/:subcomponentId")
  .all(authenticateJWT([1]))
  .put((req, res) => {
    Subcomponent.findById(req.params.subcomponentId)
        .then((Subcomponent) => {
            //student marks from db
            const storedStudentMarks = Subcomponent.studentMarks;
            var storedMap = new Map();
            
            //add to storedMap
            if(storedStudentMarks!=null){
                storedStudentMarks.forEach(function(value,key){
                    storedMap.set(key, value);
                })
            }
            else{
                res.status(400).json("Invalid request");
                return;
            }

            //new student marks map
            const studentMarks = req.body.studentMarks;            
            //add to storedMap
            if(studentMarks!=null){
                for(var newValue in studentMarks){
                    var boolFound = false;
                    //find key to change
                    storedStudentMarks.forEach(function(value,key){
                        if(key == newValue) {
                            console.log("keyIN = " + key);
                            console.log("old marks = " + value);
                            console.log("new marks = " + studentMarks[newValue]);
                            storedMap.set(key, studentMarks[newValue]);
                            boolFound = true;
                        }
                    })
                    //if not found, all
                    if(!boolFound){   
                        console.log("cannot find, insert to map");
                        storedMap.set(newValue, studentMarks[newValue]);
                        console.log(newValue + " added");
                    }
                }
            }

            //update to db
            Subcomponent.studentMarks = storedMap ?? Subcomponent.studentMarks;

            Subcomponent
            .save()
            .then(() => res.json("student Marks updated!"))
            .catch((err) => res.status(400).json("Error: " + err));
        })
        .catch((err) => res.status(400).json("Error: " + err));
    });



/* ----------------------- for debugging ------------------------- */
//Delete with Problem: deleted subcomponent but conponent still have the record
//Delete a subcomponent by id
router.route("/:id")
.delete(async(req, res) => {
    Subcomponent.findByIdAndDelete(req.params.id)
        .then(() => res.json("Subcomponent deleted."))
        .catch((err) => res.status(400).json("Error: " + err));
});

/* --------------------------------------------------------------- */

export default router;