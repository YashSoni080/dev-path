import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
  {
    domain: { type: mongoose.Schema.Types.ObjectId, ref: "Domain", required: true },
    title: { type: String, required: true, trim: true }, // e.g. "Arrays & Hashing"
    description: { type: String, default: "" },
    order: { type: Number, required: true }, // position on the roadmap trail
  },
  { timestamps: true }
);

topicSchema.index({ domain: 1, order: 1 });

export default mongoose.model("Topic", topicSchema);
