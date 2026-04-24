import mongoose, { Schema, Document } from "mongoose";

export interface ICall extends Document {
  roomId: string;
  clientId: string;
  interpreterId: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  rating: number;
  status: "completed" | "cancelled" | "failed";
  serviceType: string;
}

const CallSchema: Schema = new Schema(
  {
    roomId: { type: String, required: true },
    clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    interpreterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date, default: Date.now },
    duration: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    status: { 
      type: String, 
      enum: ["completed", "cancelled", "failed"], 
      default: "completed" 
    },
    serviceType: { type: String, default: "Video Call" },
  },
  { timestamps: true }
);

export default mongoose.models.Call || mongoose.model<ICall>("Call", CallSchema);
