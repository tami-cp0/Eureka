import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema({
  type: { type: String, default: 'Chapter' },
  content: { type: String, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
});

export default chapterSchema;
