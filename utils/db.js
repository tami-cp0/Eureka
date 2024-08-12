import mongoose from 'mongoose';
import { config } from 'dotenv';

config({ path: '../.env' }); // load env variables

class DB {
  constructor() {
    this.uri = process.env.DB_URI;
    this.alive = false;

    this.connect();
  }

  async connect() {
    try {
      await mongoose.connect(this.uri, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 5000 });
      this.alive = true;
      console.log("Connected to MongoDB");
    } catch (err) {
      this.alive = false;
      console.error("Failed to connect to MongoDB:", err);
    }
  }
}

const db = new DB();
setTimeout(() => {
  console.log(db.alive);
}, 4000);