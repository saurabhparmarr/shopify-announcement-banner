import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable not set");
}

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(MONGODB_URI);
  isConnected = true;
  console.log("MongoDB connected");
}

const announcementSchema = new mongoose.Schema({
  text: { type: String, required: true },
  shop: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Announcement =
  mongoose.models.Announcement ||
  mongoose.model("Announcement", announcementSchema);