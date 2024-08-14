import { Router } from "express";
import UsersController from "../controllers/UserController.js";
import AuthController from "../controllers/AuthController.js";

const router = Router()

// routes directly related to pages
// SignUp
router.get('/signup', (req, res) => {
  const error = {};
  res.render('signup', { error });
});
router.post('/signup', UsersController.postNewUser);

// Login
router.get('/login', (req, res) => {
  const error = {};
  res.render('login', { error });
});
router.post('/login', AuthController.connect, (req, res) => {
  res.redirect('/home');
});


router.use('/home', AuthController.loginRequired,(req, res) => {
  res.render('home');
});

// router.use('/publish', (req, res) => {
//   res.render('publish');
// });

// router.use('/courses/browse', (req, res) => {
//   res.render('courses/browse');
// });

// router.use('/courses/ongoing', (req, res) => {
//   res.render('courses/ongoing');
// });

// router.use('/courses/published', (req, res) => {
//   res.render('courses/published');
// });

// router.use('/courses/drafts', (req, res) => {
//   res.render('courses/drafts');
// });


// routes for information

export default router;