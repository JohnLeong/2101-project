import mongoose from "mongoose";

const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    commentType: Boolean, //true = summative, false = formative
    studentId: { type: Schema.Types.ObjectId, ref: "User" },
    postedBy: { type: Schema.Types.ObjectId, ref: "User" },
    body: String,
    datePosted: Date,
  }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
