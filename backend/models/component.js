import mongoose from "mongoose";

const Schema = mongoose.Schema;

const componentSchema = new Schema(
  {
    name: String,
    componentType: String,
    weightage: Number,
    subcomponents: [{ type: Schema.Types.ObjectId, ref: "SubComponent" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  }
);

const Component = mongoose.model("Component", componentSchema);

export default Component;
