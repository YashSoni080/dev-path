import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", default: null },
    domain: { type: mongoose.Schema.Types.ObjectId, ref: "Domain", required: true },
    isMasterCourse: { type: Boolean, default: false }, // true for full A-to-Z courses / master sheets
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["video", "playlist", "doc", "sheet", "article", "github"],
      required: true,
    },
    description: { type: String, default: "" },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // null for seeded/curated resources
  },
  { timestamps: true }
);

resourceSchema.index({ domain: 1, isMasterCourse: 1 });
resourceSchema.index({ topic: 1 });
resourceSchema.index({ title: "text", description: "text" });

export default mongoose.model("Resource", resourceSchema);
