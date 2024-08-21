import DB from '../db/db.js';
import { ObjectId } from 'mongodb';

class CoursesController {
  static async postCourse(req, res) {
    // {course: {schema json form}, sections: [quiz or chapter, in their schema json form]}
    const {
      title, duration, overview, viewCount, thumbnail,
      numberOfCompletions, niche, chapters,
      quizzes, totalChapters, totalQuizzes
    } = req.body.course;

    let courseId;

    const isDraft = req.query.draft === 'true';

    try {
      // ensure user is verified
      const { userId } = req.session;
      const user = await DB.User.findById(userId);
      if (!user) {
        req.flash('error', 'User does not exist');
        return res.status(400).redirect('/signup');
      }

      const author = `${user.firstName} ${user.lastName}`;
      const createdCourse = await DB.Course.create({
        title, duration, overview, viewCount, thumbnail,
        author, numberOfCompletions, userId, isDraft,
        niche, chapters, quizzes, totalQuizzes, totalChapters
      });

      courseId = createdCourse._id;
      let chapterCount = 0;

      for (const section of req.body.sections) {
        chapterCount++;
        if ('content' in section) {
          if (!section.content) { throw new Error(`Chapter ${chapterCount} is empty.`); }

          await DB.Chapter.create({ content: section.content, courseId });
        }
        // else if ('questions' in section.questions && questions) {}
        // Quiz will be implemented later
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }

    if (isDraft) {
      return res.status(201).redirect('/courses/drafts');
    } else {
      return res.status(201).redirect(`/courses/${courseId}/view`);
    }
  }

  static async putCourse(req, res) {
    // {course: {schema json form}, sections: [quiz or chapter, in their schema json form], uploaded: false }
    const {
      title, duration, overview, viewCount, thumbnail,
      numberOfCompletions, niche, chapters,
      quizzes, totalChapters, totalQuizzes
    } = req.body.course;

    let courseId;

    const isDraft = req.query.draft === 'true';

    try {
      courseId = new ObjectId(req.params.courseId);
      // ensure user is verified
      const { userId } = req.session;
      const user = await DB.User.findById(userId);
      if (!user) {
        req.flash('error', 'User does not exist');
        return res.status(400).redirect('/signup');
      }

      const author = `${user.firstName} ${user.lastName}`;

      const createdCourse = await DB.Course.findByIdAndUpdate(
        courseId,
        {
          $set: {
            title, duration, overview, viewCount, thumbnail,
            author, numberOfCompletions, userId, isDraft,
            niche, chapters, quizzes, totalQuizzes, totalChapters
          }
        },
        { new: true }
      );

      let chapterCount = 0;

      for (const section of req.body.sections) {
        chapterCount++;
        if ('content' in section) {
          if (!section.content) { throw new Error(`Chapter ${chapterCount} is empty.`); }

          await DB.Chapter.findByIdAndUpdate(
            new ObjectId(section.id),
            { content: section.content }
          );
        }
        // else if ('questions' in section.questions && questions) {}
        // Quiz will be implemented later
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }

    if (isDraft) {
      return res.status(201).redirect('/courses/drafts');
    } else {
      return res.status(201).redirect(`/courses/${courseId}/view`);
    }
  }


  static async viewCourse(req, res) {
    const { userId } = req.session;

    try {
      const courseId = req.params.courseId;
      const user = await DB.User.findById(userId);
      if (!user) {
        req.flash('error', 'Signup required');
        return res.redirect('/signup');
      }

      const course = await DB.Course.findByIdAndUpdate(
        courseId,
        { $inc: { viewCount: 1 } },
        { new: true }
      ).populate(['userId', 'chapters', 'quizzes']);
      
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      return res.status(200).render('courses/view', { user, course });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }


  static async getCourse(req, res) {
    const { userId } = req.session;

    try {
      const courseId = req.params.courseId;
      const user = await DB.User.findById(userId);
      if (!user) {
        req.flash('error', 'Signup required');
        return res.redirect('/signup');
      }

      const course = await DB.Course.findByIdAndUpdate(
        courseId,
        { new: true }
      ).populate(['userId', 'chapters', 'quizzes']);
      
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      return res.status(200).json(course);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getAllCourses(req, res) {
    const { userId } = req.session;

    try {
      const user = await DB.User.findById(userId);
      if (!user) {
        req.flash('error', 'Signup required');
        return res.redirect('/signup');
      }

      let courses = await DB.Course.find({
        isDraft: false,
        userId: { $ne: new ObjectId(userId) }
      });      
      if (!courses.length) { // Check if the array is empty
        return res.status(404).json([]);
      }

      return res.status(200).json(courses);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default CoursesController;
