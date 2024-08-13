import mongoose from 'mongoose';
import { config } from 'dotenv';
import userSchema from './models/user';
import chapterSchema from './models/chapter';
import quizSchema from './models/quiz';
import courseSchema from './models/course';
import startedCourseSchema from './models/startedCourse';

config({ path: '../.env' }); // Load environment variables from .env file

class DBClient {
  /**
   * Initializes the DB class and attempts to connect to MongoDB.
   * @constructor
   */
  constructor() {
    this.uri = process.env.DB_URI;
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
      await mongoose.connect(this.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
      });
      this.alive = true;
      console.log("Connected to MongoDB");
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

const DBClient = new DBClient();
export default DBClient;

// Check the connection status after a short delay
setTimeout(() => {
  console.log(db.alive);
}, 4000);
