import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  duration: { type: String, default: '' },
  overview: { type: String, default: '' },
  viewCount: { type: Number, default: 0 },
  thumbnail: { type: Buffer },
  author: { type: String, default: '' },
  numberOfCompletions: { type: Number, default: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isDraft: { type: Boolean, default: true },
  niche: { type: String, default: '' },
  chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', default: [] }],
  quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', default: [] }],
  totalChapters: { type: Number, default: 0 },
  totalQuizzes: { type: Number, default: 0 }
});

export default courseSchema;
