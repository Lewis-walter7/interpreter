import mongoose, { Schema, Document } from "mongoose";

export interface IReport extends Document {
  reporterId: mongoose.Types.ObjectId;
  reportedUserId: mongoose.Types.ObjectId;
  callId?: mongoose.Types.ObjectId;
  reason: string;
  description: string;
  status: "pending" | "resolved" | "dismissed";
  adminNotes?: string;
}

const ReportSchema: Schema = new Schema(
  {
    reporterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reportedUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    callId: { type: Schema.Types.ObjectId, ref: "Call" },
    reason: { type: String, required: true },
    description: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["pending", "resolved", "dismissed"], 
      default: "pending" 
    },
    adminNotes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Report || mongoose.model<IReport>("Report", ReportSchema);
