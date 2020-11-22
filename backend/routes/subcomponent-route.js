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

        const component = await Component.findById(req.params.componentId).exec();
        if (!component) {
            res.status(400).json("Invalid component id");
            return;
        }

        const newSubcomponent = new Subcomponent({
            name: name,
            weightage: weightage,
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
                if (storedStudentMarks != null) {
                    storedStudentMarks.forEach(function (value, key) {
                        storedMap.set(key, value);
                    })
                }

                var errRecordCounter = 0;
                //new student marks map
                const studentMarks = req.body.studentMarks;
                //add to storedMap
                if (studentMarks != null) {
                    for (var newKey in studentMarks) {
                        //check if marks is >= 0 and <= 100
                        if (studentMarks[newKey] <= 100 && studentMarks[newKey] >= 0) {
                            storedMap.set(newKey, studentMarks[newKey]);
                        }
                        else {
                            ++errRecordCounter;
                        }
                    }
                }

                //determine success msg to return from backend to frontend
                var msgSuccessful = "";
                if (errRecordCounter > 0) {
                    msgSuccessful = errRecordCounter + " record(s) skipped. Students Marks added!";
                } else {
                    msgSuccessful = "Student Marks added!";
                }
                //update to db
                subcomponent.studentMarks = storedMap ?? subcomponent.studentMarks;

                subcomponent
                    .save()
                    .then(() => res.json(msgSuccessful))
                    .catch((err) => res.status(400).json("Error: " + err));
            })
            .catch((err) => res.status(400).json("Error: " + err));
    });



//Route: put ...url.../subcomponent/new/importmarks/<componentId>
//Roles: Lecturer
//import student marks from CSV on per component basis
//Input para: component id
//Input json: {dataOutput: 'email,marks,subcomponent name\r\n' + 
//              'trishraymond@sit.singaporetech.edu.sg,40,Quiz 1\r\n' +
//              'twannakirshner@sit.singaporetech.edu.sg,20,Quiz 1\r\n'}
router
    .route("/new/importmarks/:componentId")
    //.all(authenticateJWT([1]))
    .put(async (req, res) => {
        //store key value pair for subcomponet name to studentMarks
        var subcompNameMarks = {};
        //store id to subcompName
        var subcompNameId = {};

        //count the number of error document
        var errRecordCounter = 0;
        var msgSuccessful = "";

        //get students _id enrolled into the component
        const students = await Module.find(
            { components: req.params.componentId },
            { users: 1, _id: 0 }
        ).exec();

        //if no document returned
        if (!students) {
            res.status(400).json("No students enrolled into this module component");
            return;
        }

        //query component with subcomponents
        await Component.findById(req.params.componentId)
            .populate("subcomponents")
            .exec()
            .then((component) => {
                //if no document returned
                if (!component) {
                    res.status(400).json("Invalid component id");
                    return;
                }

                //store each subcomponent into array
                //store each subcomponent studentMarks into Map
                for (let index = 0; index < component["subcomponents"].length; ++index) {
                    //student marks from db
                    const storedStudentMarks = component["subcomponents"][index]["studentMarks"];
                    //subcomponent Name
                    const currentSubcomName = (component["subcomponents"][index]["name"]).toString().toLowerCase();
                    //add student marks from db to storedMap
                    var storedMap = new Map();
                    if (storedStudentMarks != null) {
                        storedStudentMarks.forEach(function (value, key) {
                            storedMap.set(key, value);
                        })
                    }
                    //store to dictory for future checking
                    subcompNameMarks[currentSubcomName] = storedMap;
                    subcompNameId[currentSubcomName] = (component["subcomponents"][index]["_id"]);
                }
            })
            .catch((err) => res.status(400).json("Error: " + err));

        //new student marks
        const importMarks = req.body.dataOutput;
        if (importMarks === null) {
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
            if (element === '') {
                return;
            }
            colSeparated.push(element.split(","));
        });
        // check for "email" & "marks" & "Subcomponent Name" header
        var emailIndex = -1;
        var marksIndex = -1;
        var subcomIndex = -1;
        for (let index = 0; index < colSeparated[0].length; ++index) {
            if ((colSeparated[0][index]).toString().toLowerCase().localeCompare("email") === 0) {
                emailIndex = index;
            }
            else if ((colSeparated[0][index]).toString().toLowerCase().localeCompare("marks") === 0) {
                marksIndex = index;
            }
            else if ((colSeparated[0][index]).toString().toLowerCase().replace(/\s/g,"")
                .localeCompare("subcomponentname") === 0) {
                subcomIndex = index;
            }
        }
        //if either 1 of the cols not available, return err
        if ((emailIndex === -1) || (marksIndex === -1) || (subcomIndex === -1)) {
            console.log(emailIndex + " " + marksIndex + " " + subcomIndex);
            console.log("Invalid CSV file");
            res.status(400).json("Invalid CSV file");
            return;
        }

        //skip header row
        //loop through each document row in the CSV file
        for (let index = 1; index < colSeparated.length; ++index) {
            const currentKeyEmail = colSeparated[index][emailIndex];
            const currentValue = colSeparated[index][marksIndex];
            const currentSubName = colSeparated[index][subcomIndex].toString().toLowerCase().replace(/\s/g,"");

            var currentMatchSubName = "";

            //check for invalid document for subcomponenet name
            var boolSubcomNameMatch = false;
            for (let index = 0; index < Object.keys(subcompNameMarks).length; ++index) {
                if (boolSubcomNameMatch) {
                    continue;
                }
                if ((Object.keys(subcompNameMarks)[index]).replace(/\s/g,"")
                    .localeCompare(currentSubName) === 0) {
                    boolSubcomNameMatch = true;
                    currentMatchSubName = Object.keys(subcompNameMarks)[index];
                }
            }
            if (!boolSubcomNameMatch) {
                console.log(currentKeyEmail + " invalid Component Name");
                ++errRecordCounter;
                continue;
            }

            //check for invalid document for invalid marks
            if (currentValue > 100 || currentValue < 0) {
                console.log(currentKeyEmail + " invalid marks");
                ++errRecordCounter;
                continue;
            }

            //check for valid student email
            //email to id
            //get users id enrolled into the component
            const currentKeyId = await User.findOne(
                { email: currentKeyEmail },
                { _id: 1 }
            ).exec();
            //email not found
            if (!currentKeyId) {
                console.log(currentKeyEmail + " invalid email");
                ++errRecordCounter;
                continue;
            }

            //check for valid id in students
            const currentKeyIdOnly = (currentKeyId["_id"]).toString();
            var boolStudentIdMatch = false;
            for (let index = 0; index < students[0]["users"].length; ++index) {
                if (boolStudentIdMatch) {
                    continue;
                }
                const currentStudentId = (students[0]["users"][index]).toString();
                if (currentStudentId.localeCompare(currentKeyIdOnly) === 0) {
                    boolStudentIdMatch = true;
                }
            }
            if (!boolStudentIdMatch) {
                console.log(currentKeyEmail + " Invalid Student");
                ++errRecordCounter;
                continue;
            }

            //valid input, check if update stored values or add in
            var boolToUpdate = false;
            //find key to change
            if(subcompNameMarks[currentMatchSubName] !=null){
                subcompNameMarks[currentMatchSubName].forEach(function (value, key) {
                    if (key === currentKeyIdOnly) {
                        //change value in key
                        subcompNameMarks[currentMatchSubName].set(key, currentValue);
                        boolToUpdate = true;
                        console.log(currentKeyEmail + " updated");
                    }
                })
            }
            //if not found, add into map
            if (!boolToUpdate) {
                subcompNameMarks[currentMatchSubName].set(currentKeyIdOnly, currentValue);
                console.log(currentKeyEmail + " added");
            }

            //update db on a per CSV row basis
            //based on subcomponent name (converted to id)
            await Subcomponent.findById(subcompNameId[currentMatchSubName])
                .then((subcomponent) => {
                    //update to db
                    subcomponent.studentMarks =
                        subcompNameMarks[currentMatchSubName] ?? subcomponent.studentMarks;

                    subcomponent
                        .save()
                        .then()
                        .catch((err) => res.status(400).json("Error: " + err));
                })
                .catch((err) => res.status(400).json("Error: " + err));

            console.log("Row " + index + " Saved to db.");
        }

        //if checked through and all invalid document
        if (errRecordCounter === (colSeparated.length - 1)) {
            console.log("Invalid CSV file - all rows skipped");
            res.status(400).json("Invalid CSV file");
            return;
        }

        //determine success rate
        if (errRecordCounter > 0) {
            msgSuccessful = errRecordCounter + " record(s) skipped. Successfully imported marks.";
        }
        else {
            msgSuccessful = "Successfully imported marks";
        }
        console.log(msgSuccessful);
        res.json(msgSuccessful);
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
                if (storedStudentMarks != null) {
                    storedStudentMarks.forEach(function (value, key) {
                        storedMap.set(key, value);
                    })
                }
                else {
                    res.status(400).json("Invalid request");
                    return;
                }

                var errRecordCounter = 0;
                //new student marks map
                const studentMarks = req.body.studentMarks;

                //add to storedMap
                if (studentMarks != null) {
                    for (var newKey in studentMarks) {
                        if (studentMarks[newKey] > 100 || studentMarks[newKey] < 0) {
                            ++errRecordCounter;
                            continue;
                        }

                        //find key to change
                        var boolFound = false;
                        storedStudentMarks.forEach(function (value, key) {
                            if (key === newKey) {
                                console.log("new marks = " + studentMarks[newKey]);
                                storedMap.set(key, studentMarks[newKey]);
                                boolFound = true;
                            }
                        })
                        //if not found, add into map
                        if (!boolFound) {
                            storedMap.set(newKey, studentMarks[newKey]);
                            console.log(newKey + " added");
                        }
                    }
                }

                var msgSuccessful = "";
                if (errRecordCounter > 0) {
                    msgSuccessful = errRecordCounter + " record(s) skipped. student Marks updated!";
                } else {
                    msgSuccessful = "student Marks updated!";
                }

                //update to db
                subcomponent.studentMarks = storedMap ?? subcomponent.studentMarks;

                subcomponent
                    .save()
                    .then(() => res.json(msgSuccessful))
                    .catch((err) => res.status(400).json("Error: " + err));
            })
            .catch((err) => res.status(400).json("Error: " + err));
    });

/* ----------------------- for debugging ------------------------- */
//Delete a subcomponent by id
router.route("/:subcomponentId")
    .delete(async (req, res) => {
        await Subcomponent.findByIdAndDelete(req.params.subcomponentId);

        await Component.update(
            {},
            { $pull: { subcomponents: req.params.subcomponentId}},
            { multi: true }
        )
        .then(() => res.json("Subcomponent deleted."))
        .catch((err) => res.status(400).json("Error: " + err));
    });

//remove totalmarks field
// router.route("/debug/remove/totalmarks")
//     .delete(async (req, res) => {
//         await Subcomponent.updateMany(
//             {},
//             { $unset: {"totalMarks": ""} }
//         )
//         .then(() => res.json("Removed totalMarks field from Subcomponent."))
//         .catch((err) => res.status(400).json("Error: " + err));
//     });
/* --------------------------------------------------------------- */

export default router;