
import { Schema, model, models, type Document, type Model } from "mongoose";

export interface AlertItem extends Document {
  userId: string;
  symbol: string;
  name: string;
  type: "price" | "percent" | "volume";
  condition: "above" | "below";
  threshold: number;
  frequency: "Once per day" | "Once per hour" | "Once per minute";
  createdAt: Date;
}

const AlertSchema = new Schema<AlertItem>(
  {
    userId: { type: String, required: true, index: true },
    symbol: { type: String, required: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["price", "percent", "volume"],
      required: true,
    },
    condition: {
      type: String,
      enum: ["above", "below"],
      required: true,
    },
    threshold: { type: Number, required: true },
    frequency: {
      type: String,
      enum: ["Once per day", "Once per hour", "Once per minute"],
      default: "Once per day",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Allow multiple alerts per symbol? Usually yes.
// Indexing
AlertSchema.index({ userId: 1, symbol: 1 });

export const Alert: Model<AlertItem> =
  (models?.Alert as Model<AlertItem>) ||
  model<AlertItem>("Alert", AlertSchema);
