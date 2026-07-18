import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["video", "playlist", "doc", "sheet", "article", "github"],
      required: true,
    },
    description: { type: String, default: "" },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // null for seeded/official resources
  },
  { timestamps: true }
);

resourceSchema.index({ title: "text", description: "text" });

export default mongoose.model("Resource", resourceSchema);
