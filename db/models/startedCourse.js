import mongoose from "mongoose";

const startedCourseSchema = new mongoose.Schema({
  startedAt: { type: Date, default: Date.now },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  completedChapters: { type: Number, default: 0 },
  totalChapters: { type: Number, required: true },
  completedQuizzes: { type: Number, default: 0 },
  totalQuizzes: { type: Number, required: true },
  completionPercentage: {
    type: Number,
    default: function() {
      const totalItems = this.totalChapters + this.totalQuizzes;
      const completedItems = this.completedChapters + this.completedQuizzes;
      return totalItems ? (completedItems / totalItems) * 100 : 0;
    }
  }
});

export default startedCourseSchema;
