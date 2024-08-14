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
    let error;

    if (!(email || password || firstName || lastName || confirm)) {
      error = { message: 'Missing details'};
      return res.status(400).render('signup', { error });
    }

    if (password != confirm) {
      error = { message: 'Password is not identical'};
      return res.status(400).render('signup', { error });
    }

    const emailExists = await DB.User.findOne({ email });

    if (emailExists) { 
      error = { message: 'Email already exists'};
      return res.status(400).render('signup', { error });
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
      error = { message: '500 Internal server error'};
      return res.status(500).render('signup', { error });
    }

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
}

export default UsersController;
