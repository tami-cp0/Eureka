import DB from '../db/db.js';
import { ObjectId } from 'mongodb';

class CoursesController {
  static async postCourse(req, res) {
    // {course: {schema json form}, sections: [quiz or chapter, in their schema json form]}
    const {
      title, duration, overview, thumbnail,
      niche, totalChapters, totalQuizzes
    } = req.body.course;

    let courseId;

    // check whether it was saved as draft or not
    const isDraft = req.query.draft === 'true';

    try {
      // ensure user is verified
      const { userId } = req.session;
      const user = await DB.User.findById(userId);
      if (!user) {
        req.flash('error', 'User does not exist');
        return res.status(400).json({ redirect: '/signup' });
      }

      const author = `${user.firstName} ${user.lastName}`;
      const createdCourse = await DB.Course.create({
        title, duration, overview, thumbnail,
        author, userId, isDraft,
        niche, totalQuizzes, totalChapters
      });

      courseId = createdCourse._id;

      // Will contain ids of chapters or quizzes in order
      const sectionIds = [];

      for (const section of req.body.sections) {
        if (section.type === 'Chapter') {
          const newChapter = await DB.Chapter.create({ content: section.content, courseId });
          sectionIds.push({ id: newChapter._id, type: 'Chapter'});
        }
        // else if ('questions' in section.questions && questions) {}
        // Quiz will be implemented later
      }

      createdCourse.sections = sectionIds;
      await createdCourse.save();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }

    if(isDraft === true) {
      return res.status(201).json({ courseId });
    }
  
    return res.status(201).json({ redirect: `/course/${courseId}/view`, courseId });
  }

  static async putCourse(req, res) {
    // {course: {schema json form}, sections: [quiz or chapter, in their schema json form], uploaded: false }
    const {
      title, duration, overview, thumbnail,
      niche, totalChapters, totalQuizzes
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
        return res.status(400).json({ redirect: '/signup' });
      }

      const author = `${user.firstName} ${user.lastName}`;
      const updatedCourse = await DB.Course.findByIdAndUpdate(
        courseId,
        {
          $set: {
            title, duration, overview, thumbnail,
            author, userId, isDraft,
            niche, totalQuizzes, totalChapters
          }
        },
        { new: true }
      );

      // Will contain ids of chapters or quizzes in order
      const sectionIds = [];

      // instead of updating, i will just remove and recreate. TEMPORARY
      await DB.Chapter.deleteMany({ courseId });

      for (const section of req.body.sections) {
        if (section.type === 'Chapter') {
          const newChapter = await DB.Chapter.create({ content: section.content, courseId });
          sectionIds.push({ id: newChapter._id, type: 'Chapter'});
        }
        // else if ('questions' in section.questions && questions) {}
        // Quiz will be implemented later
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }

    if(isDraft === true) {
      return res.status(201).json({ courseId });
    }
  
    return res.status(201).json({ redirect: `/course/${courseId}/view`, courseId });
  }

  static async viewCourse(req, res) {
    const { userId } = req.session;

    try {
      const courseId = req.params.courseId;
      const user = await DB.User.findById(userId);
      if (!user) {
        req.flash('error', 'User does not exist');
        return res.status(400).json({ redirect: '/signup' });
      }

      const course = await DB.Course.findByIdAndUpdate(
        courseId,
        { $inc: { viewCount: 1 } },
        { new: true }
      );
      
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      if (course.userId !== user._id) {
        const index = user.recents.indexOf(course._id);
        if (index !== -1) {
          user.recents.splice(index, 1);
        }

        // Add course._id to the beginning of the list
        user.recents.unshift(course._id);

        // Trim the list to only keep the top 10 recents
        if (user.recents.length > 10) {
          user.recents = user.recents.slice(0, 10);
        }

        await user.save();
      }

      return res.status(200).render('courses/view', { course, user });
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
        return res.status(400).json({ redirect: '/signup' });
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

  static async deleteCourse(req, res) {
    const { userId } = req.session;
  
    try {
      const courseId = req.params.courseId;
      const user = await DB.User.findById(userId);
      
      if (!user) {
        req.flash('error', 'Signup required');
        return res.status(400).json({ redirect: '/signup' });
      }
  
      const course = await DB.Course.findById(courseId);
  
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
  
      if (course.userId.toString() !== userId.toString()) {
        return res.status(401).json({ error: 'Unauthorized access' });
      }
  
      await course.deleteOne(); // Delete the course from the database
  
      return res.status(200).redirect('/courses/published'); // Redirect after successful deletion
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  

  static async getCourses(req, res) {
    const { userId } = req.session;

    try {
      const user = await DB.User.findById(userId);
      if (!user) {
        req.flash('error', 'Signup required');
        return res.status(400).json({ redirect: '/signup' });
      }

      const courses = await DB.Course.find({ isDraft: false, userId });

      return res.status(200).render('courses/published', { courses })
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getDrafts(req, res) {
    const { userId } = req.session;

    try {
      const user = await DB.User.findById(userId);
      if (!user) {
        req.flash('error', 'Signup required');
        return res.status(400).json({ redirect: '/signup' });
      }

      const courses = await DB.Course.find({ isDraft: true, userId });

      return res.status(200).render('courses/drafts', { courses })
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getPublished(req, res) {
    const { userId } = req.session;

    try {
      const user = await DB.User.findById(userId);
      if (!user) {
        req.flash('error', 'Signup required');
        return res.status(400).json({ redirect: '/signup' });
      }

      const courses = await DB.Course.find({ isDraft: false, userId });

      return res.status(200).render('courses/published', { courses })
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async get10Courses(req, res) {
    const { userId } = req.session;

    try {
        const user = await DB.User.findById(userId);
        if (!user) {
            req.flash('error', 'Signup required');
            return res.status(400).json({ redirect: '/signup' });
        }

        const courses = await DB.Course.find({ isDraft: false, userId: { $ne: userId } })
                                       .limit(10); // Get the first 10 courses

        return courses;
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getMoreCourses(req, res) {
    const { userId } = req.session;
    const { page } = req.query; // Expecting a query parameter 'page' for pagination
    const coursesPerPage = 10;
    const skip = (page - 1) * coursesPerPage;

    try {
        const user = await DB.User.findById(userId);
        if (!user) {
            req.flash('error', 'Signup required');
            return res.status(400).json({ redirect: '/signup' });
        }

        const courses = await DB.Course.find({ isDraft: false, userId: { $ne: userId } })
                                      .skip(skip) // Skip previous pages' courses
                                      .limit(coursesPerPage); // Limit to 10 courses

        return res.status(200).json(courses); // Return as JSON to be appended by the frontend
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default CoursesController;
