import express from "express";
import Module from "../models/module.js";
import ModuleClass from "../models/class.js";
import Class from "../models/class.js";
import { jwtTokenSecret } from "../secret.js";
import mongoose from "mongoose";

const router = express.Router();

/* Stuff below is for testing and reference purposes */

//Get all moduleClassses
router.route("/all").get((req, res) => {
  ModuleClass.find()
    .then((moduleClasss) => res.json(moduleClasss))
    .catch((err) => res.status(400).json("Error: " + err));
});

//Get a moduleClass by id
router.route("/:id").get((req, res) => {
  ModuleClass.findById(req.params.id)
    .then((moduleClass) => res.json(moduleClass))
    .catch((err) => res.status(400).json("Error: " + err));
});

//Add a new moduleClass
router.route("/").post((req, res) => {
  const name = req.body.name;
  const moduleId = req.body.moduleId;

  Module.findById(moduleId)
    .then((module) => {
      const newModuleClass = new ModuleClass({
        name: name,
        moduleId: moduleId,
      });
      newModuleClass
        .save()
        .then(() => {
          module.classes.push(newModuleClass.id);
          module
            .save()
            .then(() => res.json("Class added!"))
            .catch((err) => res.status(400).json("Error: " + err));
        })
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Find Error: " + err));
});

//Delete a moduleClass by id
router.route("/:id").delete((req, res) => {
  ModuleClass.findByIdAndDelete(req.params.id)
    .then(() => res.json("ModuleClass deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

//Update an existing moduleClass by id
router.route("/:id").put((req, res) => {
  ModuleClass.findById(req.params.id)
    .then((moduleClass) => {
      moduleClass.name = req.body.name;
      moduleClass.description = req.body.description;

      moduleClass
        .save()
        .then(() => res.json("ModuleClass updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

export default router;
