import mongoose from "mongoose";

const domainSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true }, // e.g. "DSA"
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true }, // e.g. "dsa"
    description: { type: String, required: true },
    icon: { type: String, default: "compass" }, // used on frontend for trail-marker icon
    color: { type: String, default: "#5B7B6B" }, // accent color for this domain's trail
  },
  { timestamps: true }
);

export default mongoose.model("Domain", domainSchema);
