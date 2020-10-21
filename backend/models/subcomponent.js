import mongoose from "mongoose";

const Schema = mongoose.Schema;

const subcomponentSchema = new Schema(
  {
    name: String,
    weightage: Number,
    totalMarks: Number,
    studentMarks: {
      type: Map,
      of: Number
    },
  }
);

// const marksSchema = new Schema({
//   studentId: { type: Schema.Types.ObjectId, ref: "User" },
//   marks: Number,
// });

const SubComponent = mongoose.model("SubComponent", subcomponentSchema);
//export const Marks = marksSchema;

export default SubComponent;