import mongoose from "mongoose";

const Schema = mongoose.Schema;

const classSchema = new Schema(
  {
    name: String,
    students: [{ type: Schema.Types.ObjectId, ref: "User" }],
    lecturers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

const Class = mongoose.model("Class", classSchema);

export default Class;
