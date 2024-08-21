import DB from '../db/db.js';
import { ObjectId } from 'mongodb';

class CoursesController {
  static async getCourse(req, res) {
    const { userId } = req.session;

    try {
      const courseId = new ObjectId(req.params.courseId);
      const user = await DB.User.findOne({ _id: userId });
      if (!user) {
        req.flash('error', 'Signup required');
        return res.redirect('/signup');
      }

      let course = await DB.Course.findById(courseId);
      if (!course) {
        return res.status(404).json({});
      }

      await DB.Course.updateOne({ _id: courseId }, { $inc: { viewCount: 1 } });

      course = {
        ...course.toObject(), // Convert to plain object
        _id: courseId.toString() // Convert id back to string
      };
      return res.status(200).json(details);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }


  static async getAllCourses(req, res) {
    const { userId } = req.session;
    try {
      const user = await DB.User.findOne({ _id: userId });
      if (!user) {
        req.flash('error', 'Signup required');
        return res.redirect('/signup');
      }

      let courses = await DB.Course.find({ isDraft: false });
      if (!courses.length) { // Check if the array is empty
        return res.status(404).json([{}]);
      }

      // Convert each course to a plain object and convert _id to a string
      courses = courses.map(course => ({
        ...course.toObject(), // Convert to plain object
        _id: course._id.toString() // Convert _id to string
      }));

      return res.status(200).json(courses);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default CoursesController;
