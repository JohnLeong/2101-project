import mongoose from "mongoose";

const Schema = mongoose.Schema;

const subcomponentSchema = new Schema(
  {
    name: String,
    weightage: Number,
    totalMarks: Number,
    studentMarks: [marksSchema],
  },
  {
    timestamps: true,
  }
);

const marksSchema = new Schema(
    {
      studentId: { type: Schema.Types.ObjectId, ref: "User" },
      marks: Number,
    },
  );

const SubComponent = mongoose.model("SubComponent", subcomponentSchema);

export default SubComponent;
