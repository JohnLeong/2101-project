import mongoose from "mongoose";

const Schema = mongoose.Schema;

const moduleSchema = new Schema(
  {
    name: String,
    description: String,
    components: [{ type: Schema.Types.ObjectId, ref: "Component" }],
    classes: [{ type: Schema.Types.ObjectId, ref: "ModuleClass" }],
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  }
);

const Module = mongoose.model("Module", moduleSchema);

export default Module;
