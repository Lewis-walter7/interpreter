import mongoose, { Schema, Document } from "mongoose";

export interface ISettings extends Document {
  key: string;
  value: any;
  description?: string;
  updatedBy?: string;
}

const SettingsSchema: Schema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
    description: { type: String },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);
