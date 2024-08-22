import mongoose from "mongoose";

// publishedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],

const userSchema = new mongoose.Schema({
  type: { type: String, default: 'User' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  pfp: { type: Buffer, default: Buffer.from([]) },
  recents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: [] }]
});

userSchema.pre('remove', async function(next) {
  try {
    await DB.Course.deleteMany({ userId: this._id });
    // Repeat for other models if needed
    next();
  } catch (err) {
    next(err);
  }
});

export default userSchema;
