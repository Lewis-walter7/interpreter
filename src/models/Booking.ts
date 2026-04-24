import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  clientId: string;
  interpreterId: string;
  startTime: Date;
  endTime: Date;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes?: string;
  serviceType: string;
}

const BookingSchema: Schema = new Schema(
  {
    clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    interpreterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { 
      type: String, 
      enum: ["pending", "confirmed", "cancelled", "completed"], 
      default: "pending" 
    },
    notes: { type: String },
    serviceType: { type: String, default: "Video Interpretation" },
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
