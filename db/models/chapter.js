import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema({
  title: { type: String, required: true, default: '' },
  content: { type: String, required: true, default: '' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
});

export default chapterSchema;
