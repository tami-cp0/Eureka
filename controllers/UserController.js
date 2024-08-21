import sha1 from 'sha1';
import DB from '../db/db.js';

class UsersController {
  /**
   * Handles user registration.
   * Validates input, checks for existing email, hashes the password, and creates a new user.
   * @param {Object} req - Express request object containing user details in the body.
   * @param {Object} res - Express response object used to render the signup page or redirect.
   */
  static async postNewUser(req, res) {
    const { firstName, lastName, email, password, confirm } = req.body;

    if (!(email || password || firstName || lastName || confirm)) {
      req.flash('error', 'Missing details');
      return res.status(400).redirect('/signup');
    }

    if (password != confirm) {
      req.flash('error', 'Password is not identical');
      return res.status(400).redirect('/signup');
    }

    const emailExists = await DB.User.findOne({ email });

    if (emailExists) { 
      req.flash('error', 'Email already exists');
      return res.status(400).redirect('/signup');
    }

    const sha1Password = sha1(password);

    try {
      await DB.User.create({
        email,
        password: sha1Password,
        firstName,
        lastName
      });
    } catch (err) {
      req.flash('error', '500 Internal server error');
      return res.status(500).redirect('/signup');
    }

    req.flash('error', 'Account Created. Login to Eureka now');
    return res.status(201).redirect('/login');
  }

  /**
   * Retrieves user details.
   * Fetches user data based on session userId and returns it in JSON format.
   * @param {Object} req - Express request object containing the user session.
   * @param {Object} res - Express response object used to return user details in JSON format.
   */
  static async getMe(req, res) {
    const { userId } = req.session;

    try {
      const user = await DB.User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).json({});
      }
  
      // Transform recents from ObjectId to strings
      const details = {
        id: userId.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        recents: user.recents.map(_id => _id.toString()) // Use map to transform array
      };
  
      return res.status(200).json(details);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * Deletes a user based on their session ID and redirects to the signup page.
   * @param {Object} req - The request object, containing session information.
   * @param {Object} res - The response object, used to redirect and send flash messages.
   * @returns {Object} Redirects to the signup page or displays an error message.
   */
  static async deleteMe(req, res) {
    try {
      const { userId } = req.session;
      await DB.User.deleteOne({ _id: userId });
      
      return res.redirect('/signup');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Signup required');
      return res.redirect('/signup');
    }
  }
}

export default UsersController;
