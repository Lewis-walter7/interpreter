import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
    },
    image: String,
    phoneNumber: String,
    password: {
      type: String,
      required: [true, "Please provide a password"],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ["client", "interpreter", "admin"],
      default: "client",
    },
    status: {
      type: String,
      enum: ["active", "deactivated"],
      default: "active",
    },
    // Interpreter specific fields
    interpreterData: {
      languages: [String],
      specialization: String,
      bio: String,
      isOnline: { type: Boolean, default: false },
      status: {
        type: String,
        enum: ["unverified", "pending", "verified", "rejected"],
        default: "unverified",
      },
      kycFiles: [
        {
          name: String,
          url: String,
          category: String, // ID, Certification, etc.
        }
      ],
      rating: { type: Number, default: 5 },
      totalReviews: { type: Number, default: 0 },
      totalMinutes: { type: Number, default: 0 },
      totalSessions: { type: Number, default: 0 },
      hourlyRate: { type: Number, default: 40 },
      balance: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
