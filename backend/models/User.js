import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 50 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: { type: String, required: true, minlength: 6, maxlength: 72 },
    isVerified: { type: Boolean, default: false },
    otp: {
      code: { type: String, default: null }, // hashed OTP code
      expiresAt: { type: Date, default: null },
      attempts: { type: Number, default: 0 },
      lastSentAt: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Public-safe representation (no password, no OTP internals)
userSchema.methods.toSafeJSON = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    isVerified: this.isVerified,
  };
};

export default mongoose.model("User", userSchema);
