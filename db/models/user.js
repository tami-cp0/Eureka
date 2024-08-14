import mongoose from "mongoose";

// publishedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  pfp: { type: String, default: '' },
  recents: [{ type: mongoose.Schema.Types.ObjectId }]
});

export default userSchema;
