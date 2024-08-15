import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  duration: { type: String, default: '' },
  overview: { type: String, default: '' },
  viewCount: { type: Number, default: 0 },
  thumbnail: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
  author: { type: String },
  numberOfCompletions: { type: Number, default: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDraft: { type: Boolean, default: true },
  niche: { type: String, default: '' },
  chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }],
  quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],
  totalChapters: { type: Number, default: 0 },
  totalQuizzes: { type: Number, default: 0 }
});

export default courseSchema;
