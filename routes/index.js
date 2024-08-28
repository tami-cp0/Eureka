import { Router } from "express";
import UsersController from "../controllers/UserController.js";
import AuthController from "../controllers/AuthController.js";
import CoursesController from "../controllers/CourseController.js";
import ChapterController from "../controllers/ChapterController.js";

const router = Router()

// routes directly related to pages
router.get('/signup', (req, res) => {
  res.render('signup');
});
router.post('/signup', UsersController.postNewUser);

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', AuthController.connect, (req, res) => {
  res.redirect('/home');
});

router.get('/logout', AuthController.loginRequired, AuthController.disconnect);

router.get('/deleteUser', AuthController.loginRequired, UsersController.deleteMe);

router.get('/', AuthController.loginRequired, (req, res) => {
  res.redirect('/home');
})


// main routes
router.get('/home', AuthController.loginRequired, async (req, res) => {
  const courses = await CoursesController.get10Courses(req, res);
  const topCourses = await CoursesController.getTopCourses(req, res);
  const recents = await UsersController.getRecents(req, res);
  res.render('home', { courses, topCourses, recents });
});

router.get('/publish', AuthController.loginRequired, (req, res) => {
  res.render('publish', { courseId: null });
});

router.get('/publish/:courseId', AuthController.loginRequired, (req, res) => {
  const courseId = req.params.courseId;
  res.render('publish', { courseId });
});

router.get('/courses/browse', AuthController.loginRequired, async (req, res) => {
  const courses = await CoursesController.get10Courses(req, res);
  res.render('courses/browse', { courses });
});

router.get('/courses/ongoing', AuthController.loginRequired, (req, res) => {
  res.render('courses/ongoing');
});

router.get('/courses/published', AuthController.loginRequired, CoursesController.getPublished);

router.get('/courses/drafts', AuthController.loginRequired, CoursesController.getDrafts);


router.get('/getMoreCourses', AuthController.loginRequired, CoursesController.getMoreCourses);


// routes related to information
router.get('/user', AuthController.loginRequired, UsersController.getMe);

router.post('/publish', AuthController.loginRequired, CoursesController.postCourse);

router.put('/publish/:courseId', AuthController.loginRequired, CoursesController.putCourse);

router.get('/course/:courseId/view', AuthController.loginRequired, CoursesController.viewCourse);
// router.get('course/start/:id', CoursesController.viewCourse);

// router.get('/course/:courseId', CoursesController.getCourse);
router.delete('/deleteCourse/:courseId', AuthController.loginRequired, CoursesController.deleteCourse);


// router.get('/courses', AuthController.loginRequired, CoursesController.getAllCourses);

// get all chapters related to the courseId
router.get('/course/:courseId/chapters', AuthController.loginRequired, ChapterController.getChapters);


export default router;