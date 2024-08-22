import express from 'express';
import { config } from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import router from './routes/index.js';
import cache from './db/cache.js';
import RedisStore from 'connect-redis';
import flash from 'connect-flash';
import cors from 'cors';
import DB from './db/db.js';

config();

const app = express();
const port = process.env.PORT || 6789; // Default port if not set

// CORS setup
// app.use(cors());

// Manually define __dirname for ES module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.set('view engine', 'ejs');

// Session setup
app.use(session({
  store: new RedisStore({ client: cache.getClient(), ttl: 86400 }),
  secret: process.env.SECRET_KEY,
  resave: true,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 86400 * 7 } // 1 week
}));

app.use(flash());

// Middleware to set user and flash messages
app.use(async (req, res, next) => {
  if (req.session.userId) {
    try {
      const user = await DB.User.findById(req.session.userId).populate({
        path: 'recents',
        select: '-password -pfp -email'
      });
      res.locals.user = user || null;
    } catch (err) {
      console.error('Failed to retrieve user:', err);
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  res.locals.flash = req.flash();
  next();
});

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/load', (req, res) => {
  res.render('partials/preloader');
});

// Mount the main router
app.use(router);

app.listen(port, () => {
  console.log(`Eureka listening at http://localhost:${port}`);
});
