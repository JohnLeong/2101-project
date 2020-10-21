import mongoose from "mongoose";

const Schema = mongoose.Schema;

const moduleClassSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      //unique: true,
    },
    students: [{ type: Schema.Types.ObjectId, ref: "User" }],
    lecturers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    moduleId: { type: Schema.Types.ObjectId, ref: "Module" },
  }
);

const ModuleClass = mongoose.model("ModuleClass", moduleClassSchema);

export default ModuleClass;
