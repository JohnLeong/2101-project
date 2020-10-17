import mongoose from "mongoose";

const Schema = mongoose.Schema;

const moduleSchema = new Schema(
  {
    name: String,
    description: String,
    components: [{ type: Schema.Types.ObjectId, ref: "Component" }],
    classes: [{ type: Schema.Types.ObjectId, ref: "Class" }],
  },
  {
    timestamps: true,
  }
);

const Module = mongoose.model("Module", moduleSchema);

export default Module;
