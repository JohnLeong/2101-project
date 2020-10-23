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

//Get all subcomponents
router.route("/all").get((req, res) => {
    Subcomponent.find()
      .then((subcomponents) => res.json(subcomponents))
      .catch((err) => res.status(400).json("Error: " + err));
  });

//Get a subcomponent by id
router.route("/:id").get((req, res) => {
    Subcomponent.findById(req.params.id)
      .then((subcomponent) => res.json(subcomponent))
      .catch((err) => res.status(400).json("Error: " + err));
  });


//Route: POST ...url.../subcomponent/new/<componentId>
//Roles: Lecturer
//Add a new subcomponent to a component
router
  .route("/new/:componentId")
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

  //TODO: deleted subcomponent but conponent still have the record
  //debugging
  //Delete a component by id
  router.route("/:id").delete((req, res) => {
    Subcomponent.findByIdAndDelete(req.params.id)
      .then(() => res.json("Subcomponent deleted."))
      .catch((err) => res.status(400).json("Error: " + err));
  });

export default router;