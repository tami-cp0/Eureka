import { Router } from "express";
import UsersController from "../controllers/UserController.js";
import AuthController from "../controllers/AuthController.js";
import CoursesController from "../controllers/CourseController.js";

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

router.get('/logout', AuthController.disconnect);

router.delete('/deleteUser', AuthController.loginRequired, UsersController.deleteMe);

router.get('/', (req, res) => {
  res.redirect('/publish');
})


// main routes
router.get('/home', (req, res) => {
  res.render('home');
});

router.use('/publish', (req, res) => {
  res.render('publish');
});

router.use('/courses/browse', (req, res) => {
  res.render('courses/browse');
});

router.use('/courses/ongoing', (req, res) => {
  res.render('courses/ongoing');
});

router.use('/courses/published', (req, res) => {
  res.render('courses/published');
});

router.use('/courses/drafts', (req, res) => {
  res.render('courses/drafts');
});


// routes related to information
router.get('/user', UsersController.getMe);

router.post('/publish', CoursesController.postCourse);
router.put('/publish', CoursesController.putCourse);

router.get('course/:id/view', CoursesController.viewCourse);

router.get('courses/:id', CoursesController.getCourse);
router.get('/courses', CoursesController.getAllCourses);


export default router;