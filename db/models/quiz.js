import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  type: { type: String, default: 'Quiz' },
  questions: [{
    text: String,
    options: [String], // Array of 4 options
    correctOption: Number // Index of the correct option
  }],
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
});

export default quizSchema;