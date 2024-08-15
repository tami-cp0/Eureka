import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  description: { type: String, default: '' },
  data: { type: Buffer, default: '' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
});

export default imageSchema;
