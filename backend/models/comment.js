import mongoose from "mongoose";

const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    name: String,
    commentType: Boolean, //true = summative, false = formative
    studentId: { type: Schema.Types.ObjectId, ref: "User" },
    body: String,
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
