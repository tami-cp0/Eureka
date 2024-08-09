import express from 'express';
import path, { normalize } from 'path';

const server  = express();

// Middleware
server.use(express.json());
// serve the assets
server.use('/public', express.static(__dirname + '/public'));
// Set the view engine to EJS
server.set('view engine', 'ejs');

server.use('/signup', (req, res) => {
  res.render('signup');
});

server.use('/login', (req, res) => {
  res.render('login');
});

server.use('/home', (req, res) => {
  res.render('home');
});

const PORT = process.env.PORT || 6789;
server.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});