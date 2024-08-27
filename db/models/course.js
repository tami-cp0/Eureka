import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  type: { type: String, default: 'Course' },
  title: { type: String, default: '' },
  duration: { type: String, default: '' },
  overview: { type: String, default: '' },
  viewCount: { type: Number, default: 0 },
  completedCount: { type: Number, default: 0 },
  startCount: { type: Number, default: 0 },
  thumbnail: {
    data: { type: String, default: '' },
    mimeType: { type: String, default: '' }
  },
  author: { type: String, default: '' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isDraft: { type: Boolean, default: true },
  niche: { type: String, default: '' },
  sections: {
    type: [{
      id: { type: mongoose.Schema.Types.ObjectId, refPath: 'sections.type', required: true },
      type: { type: String, enum: ['Chapter', 'Quiz'], required: true }
    }],
    default: []  // Default value for sections field
  },
  totalChapters: { type: Number, default: 0 },
  totalQuizzes: { type: Number, default: 0 },
  totalSections: { type: Number, default: 0 }
});

courseSchema.pre('save', function(next) {
  this.totalSections = this.totalChapters + this.totalQuizzes;
  next();
});

courseSchema.pre('remove', async function(next) {
  try {
    await DB.Chapter.deleteMany({ courseId: this._id });
    // Repeat for other models if needed
    next();
  } catch (err) {
    next(err);
  }
});

export default courseSchema;
