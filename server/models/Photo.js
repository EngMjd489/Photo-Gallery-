import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,

  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
}, { timestamps: true});

export default mongoose.model("Photo", photoSchema);
