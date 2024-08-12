import { Router } from "express";

const router = Router()

// Authentication
router.use('/signup', (req, res) => {
  res.render('signup');
});

router.use('/login', (req, res) => {
  res.render('login');
});

router.use('connect', )


router.use('/home', (req, res) => {
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

