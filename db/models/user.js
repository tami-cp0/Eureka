import mongoose from "mongoose";

// publishedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  pfp: { type: String, default: '' },
  recents: [{ type: mongoose.Schema.Types.ObjectId }]
});

export default userSchema;
