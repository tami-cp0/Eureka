import DB from '../db/db.js';
import { ObjectId } from 'mongodb';

class ChapterController {
  static async getChapters(req, res) {
    const { userId } = req.session;

    try {
      const user = await DB.User.findById(userId);
      if (!user) {
        req.flash('error', 'Signup required');
        return res.status(400).json({ redirect: '/signup' });
      }

      const courseId = new ObjectId(req.params.courseId);
      const chapters = await DB.Chapter.find({ courseId });

      return res.status(200).json(chapters);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default ChapterController;
