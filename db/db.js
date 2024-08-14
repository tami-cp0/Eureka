import mongoose from 'mongoose';
import { config } from 'dotenv';
import userSchema from './models/user.js';
import chapterSchema from './models/chapter.js';
import quizSchema from './models/quiz.js';
import courseSchema from './models/course.js';
import startedCourseSchema from './models/startedCourse.js';

config({ path: `.env` }); // Load environment variables from .env file

class MongoDBClient {
  /**
   * Initializes the DB class and attempts to connect to MongoDB.
   * @constructor
   */
  constructor() {
    this.alive = false;

    this.connect();
  }

  /**
   * Connects to the MongoDB server using the provided URI.
   * Sets this.alive to true if the connection is successful.
   * @returns {Promise<void>}
   */
  async connect() {
    try {
      await mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
      });
      this.alive = true;
      console.log('MongoDB is connected');
      this.createModels(); // Create models after successful connection
    } catch (err) {
      this.alive = false;
      console.error("Failed to connect to MongoDB:", err);
    }
  }

  /**
   * Creates Mongoose models for the application.
   * Models are created after a successful connection to the database.
   */
  createModels() {
    this.User = mongoose.model('User', userSchema);
    this.Chapter = mongoose.model('Chapter', chapterSchema);
    this.Quiz = mongoose.model('Quiz', quizSchema);
    this.Course = mongoose.model('Course', courseSchema);
    this.StartedCourse = mongoose.model('StartedCourse', startedCourseSchema);
  }
}

const DB = new MongoDBClient();
export default DB;
