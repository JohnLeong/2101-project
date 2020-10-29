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
      .then((subcomponent) => {
        subcomponent.name = req.body.name ?? subcomponent.name;
        subcomponent.weightage = req.body.weightage ?? subcomponent.weightage;
        subcomponent.totalMarks = req.body.totalMarks ?? subcomponent.totalMarks;

        subcomponent
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
//Input json: {"studentMarks":{user_studentObjectid: marks}}
router
  .route("/new/studentmarks/:subcomponentId")
  .all(authenticateJWT([1]))
  .put((req, res) => {
    Subcomponent.findById(req.params.subcomponentId)
        .then((subcomponent) => {
            //student marks from db
            const storedStudentMarks = subcomponent.studentMarks;
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
                for(var newKey in studentMarks){
                    storedMap.set(newKey, studentMarks[newKey]);
                }
            }

            //update to db
            subcomponent.studentMarks = storedMap ?? subcomponent.studentMarks;

            subcomponent
            .save()
            .then(() => res.json("Student Marks added!"))
            .catch((err) => res.status(400).json("Error: " + err));
        })
        .catch((err) => res.status(400).json("Error: " + err));
    });

    

//Route: put ...url.../subcomponent/new/importmarks/<subcomponentId>
//Roles: Lecturer
//import student marks from CSV 
//Input para: subcomponent id
//Input json: {dataOutput: 'email,marks\r\n' + 'trishraymond@sit.singaporetech.edu.sg,40\r\n' +
//              'twannakirshner@sit.singaporetech.edu.sg,20\r\n'}
router
  .route("/new/importmarks/:subcomponentId")
  //.all(authenticateJWT([1]))
  .put((req, res) => {
    Subcomponent.findById(req.params.subcomponentId)
        .then((subcomponent) => {
            //max marks
            const maxMarks = subcomponent.totalMarks;
            //student marks from db
            const storedStudentMarks = subcomponent.studentMarks;
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
            const importMarks = req.body.dataOutput;   
            if(importMarks === null){
                console.log("Invalid request: No JSON parsed");
                res.status(400).json("Invalid request: No JSON parsed");
                return;
            }

            //data cleansing
            //separate into row
            var rowSeparated = importMarks.split("\r\n");
            //separate into column
            var colSeparated = [];
            rowSeparated.forEach(element => {
                if(element === ''){
                    return;
                }
                colSeparated.push(element.split(","));
            });

            // check for "email" & "marks" header
            var emailIndex = -1;
            var marksIndex = -1;
            for (let index = 0; index < colSeparated[0].length; ++index) {
                if((colSeparated[0][index]).toLowerCase() === 'email'){
                    emailIndex = index;
                }
                else if((colSeparated[0][index]).toLowerCase() === 'marks'){
                    marksIndex = index;
                }
            }

            //if either 1 of the cols not available, return err
            if((emailIndex === -1) || (marksIndex === -1)){
                console.log("Invalid CSV uploaded");
                res.status(400).json("Invalid CSV uploaded");
                return;
            }

            console.log("emailIndex: "+ emailIndex +" marksIndex: "+ marksIndex);

            //store into Dictionary
            var keyValue = {};
            //skip header row
            for (let index = 1; index < colSeparated.length; ++index) {
                var currentKeyEmail = colSeparated[index][emailIndex];
                var currentValue = colSeparated[index][marksIndex];
                //check for invalid row
                //invalid marks
                if(currentValue > maxMarks){
                    console.log(currentKeyEmail+ " invalid marks");
                    //TODO: err counter for invalid records
                    continue;
                }

                //TODO: invalid email
                //email to _id
                //_id to component
                //component to subconponent

                console.log(currentValue);
                keyValue[currentKeyEmail]=currentValue;
                
                var boolFound = false;
                //find key to change
                storedStudentMarks.forEach(function(value,key){
                    if(key == currentKeyEmail) {
                        //change value in key
                        storedMap.set(key, currentValue);
                        boolFound = true;
                    }
                })
                //if not found, add into map
                if(!boolFound){   
                    storedMap.set(currentKeyEmail, currentValue);
                    console.log(currentKeyEmail + " added");
                }

            }

            console.log("KEYVALUE:");
            console.log(keyValue);

            //update to db
            subcomponent.studentMarks = storedMap ?? subcomponent.studentMarks;

            subcomponent
            .save()
            .then(() => res.json("Import Successful"))
            .catch((err) => res.status(400).json("Error: " + err));
        })
        .catch((err) => res.status(400).json("Error: " + err));
    });

//Route: put ...url.../subcomponent/edit/studentmarks/<subcomponentId>
//Roles: Lecturer
//add or edit subcomponent marks for group of students 
//Input para: subcomponent id
//Input json: {"studentMarks":{user_studentObjectid: marks}}
router
  .route("/edit/studentmarks/:subcomponentId")
  .all(authenticateJWT([1]))
  .put((req, res) => {
    Subcomponent.findById(req.params.subcomponentId)
        .then((subcomponent) => {
            //student marks from db
            const storedStudentMarks = subcomponent.studentMarks;
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
                for(var newKey in studentMarks){
                    var boolFound = false;
                    //find key to change
                    storedStudentMarks.forEach(function(value,key){
                        if(key == newKey) {
                            console.log("keyIN = " + key);
                            console.log("old marks = " + value);
                            console.log("new marks = " + studentMarks[newKey]);
                            storedMap.set(key, studentMarks[newKey]);
                            boolFound = true;
                        }
                    })
                    //if not found, add into map
                    if(!boolFound){   
                        console.log("cannot find, insert to map");
                        storedMap.set(newKey, studentMarks[newKey]);
                        console.log(newKey + " added");
                    }
                }
            }

            //update to db
            subcomponent.studentMarks = storedMap ?? subcomponent.studentMarks;

            subcomponent
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