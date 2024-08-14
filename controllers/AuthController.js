import sha1 from 'sha1';
import DB from '../db/db.js';

class AuthController {
  /**
   * Handles user authentication.
   * Verifies the user's credentials and creates a session if valid.
   * @param {Object} req - Express request object containing email and password in the body.
   * @param {Object} res - Express response object used to render the login page on failure.
   * @param {Function} next - Express next middleware function.
   */
  static async connect(req, res, next) {
    const { email, password } = req.body;

    const sha1Password = sha1(password);

    try {
      const user = await DB.User.findOne({ email, password: sha1Password });
      if (!user) {
        const error = { message: 'Email or Password is invalid' };
        return res.status(401).render('login', { error });
      }

      // create user session
      req.session.userId = user._id;

      return next();
    } catch (err) {
      console.log(err);
      const error = { message: '500 Internal server error' };
      return res.status(500).render('login', { error });
    }
  }

  /**
   * Handles user logout.
   * Destroys the user's session and redirects to the login page.
   * @param {Object} req - Express request object containing the session.
   * @param {Object} res - Express response object used to redirect to login.
   */
  static async disconnect(req, res) {
    req.session.destroy(err => {
      if (err) {
        console.log(err);
        const error = { message: 'Failed to log out' };
        return res.status(500).render('login', { error });
      }
      res.redirect('/login'); // Redirect to login page or any other page
    });
  }

  /**
   * Middleware to ensure the user is logged in.
   * Redirects to the login page if the user is not authenticated.
   * @param {Object} req - Express request object containing the session.
   * @param {Object} res - Express response object used to redirect to login.
   * @param {Function} next - Express next middleware function.
   */
  static async loginRequired(req, res, next) {
    if (req.session && req.session.userId) {
      // User is logged in, proceed to the next middleware or route handler
      return next();
    } else {
      // User is not logged in, redirect to the login page
      res.redirect('/login');
    }
  }
}

export default AuthController;
