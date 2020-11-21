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

/* ----------------------- for debugging ------------------------- */
//Get all comments
router.route("/all").get((req, res) => {
    Comment.find()
        .then((comment) => res.json(comment))
        .catch((err) => res.status(400).json("Error: " + err));
});

/* --------------------------------------------------------------- */

//Route: GET ...url.../comment/<commentId>
//Roles: Lecturer, Student
//Get a comment by id
router
    .route("/:commentId")
    .all(authenticateJWT([1, 2]))
    .get((req, res) => {
        Comment.findById(req.params.commentId)
            .then((comment) => res.json(comment))
            .catch((err) => res.status(400).json("Error: " + err));
    });


//Route: POST ...url.../comment/new/<componentId>
//Roles: Lecturer
//Add a new comment to a component
router
    .route("/new/:componentId")
    .all(authenticateJWT([1]))
    .post(async (req, res) => {
        const commentType = req.body.commentType;
        const studentId = req.body.studentId;
        const postedBy = req.body.postedBy;
        const body = req.body.body;
        const datePosted = Date.now();

        const component = await Component.findById(req.params.componentId).exec();
        if (!component) {
            res.status(400).json("Invalid component id");
            return;
        }

        const newComment = new Comment({
            commentType: commentType,
            studentId: studentId,
            postedBy: postedBy,
            body: body,
            datePosted: datePosted
        });

        newComment
            .save()
            .then( () => {
                component.comments.push(newComment.id);
                component.save().then( () => res.json("Comment added!"));

            })
            .catch((err) => res.status(400).json("Error: " + err));
    });


//Route: PUT ...url.../comment/<commentId>
//Roles: Lecturer
//edit a comment by id
router
    .route("/:commentId")
    .all(authenticateJWT([1]))
    .put((req, res) => {
        Comment.findById(req.params.commentId)
            .then((comment) => {
                comment.commentType = req.body.commentType ?? comment.commentType;
                comment.studentId = req.body.studentId ?? comment.studentId;
                comment.postedBy = req.body.postedBy ?? comment.postedBy;
                comment.body = req.body.body ?? comment.body;
                comment.datePosted = Date.now();

                comment
                    .save()
                    .then(() => res.json("comment updated!"))
                    .catch((err) => res.status(400).json("Error: " + err));
            })
            .catch((err) => res.status(400).json("Error: " + err));
    });


/* ----------------------- for debugging ------------------------- */
//Delete a comment by id
router
    .route("/:commentId")
    .delete(async (req, res) => {
        await Comment.findByIdAndDelete(req.params.commentId);

        await Component.updateOne(
            {},
            { $pullAll: { comments: [req.params.commentId] } }
        )
        .then(() => res.json("Comment deleted."))
        .catch((err) => res.status(400).json("Error: " + err));
    });

/* --------------------------------------------------------------- */

export default router;