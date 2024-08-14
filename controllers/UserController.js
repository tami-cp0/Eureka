import sha1 from 'sha1';
import cache from '../db/cache.js';
import DB from '../db/db.js';

class UsersController {
  static async postNewUser(req, res) {
    const { firstName, lastName, email, password, confirm } = req.body;
    let error;

    if (!(email || password || firstName || lastName || confirm)) {
      error = { message: 'Missing details'};
      return res.status(401).render('signup', { error });
    }

    if (password != confirm) {
      error = { message: 'Password is not identical'};
      return res.status(401).render('signup', { error });
    }

    const emailExists = await DB.User.findOne({ email });

    if (emailExists) { 
      error = { message: 'Email already exists'};
      return res.status(401).render('signup', { error });
    }

    const sha1Password = sha1(password);

    try {
      await DB.User.insertOne({
        email,
        password: sha1Password,
        firstName,
        lastName
      });
    } catch (err) {
      error = { message: '500 Internal server error'};
      return res.status(401).render('signup', { error });
    }

    return res.status(201).redirect('/login');
  }

  static async getMe(req, res) {
    

    const user = await dbClient.users.findOne({ _id: id });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    return res.status(200).json({ id, email: user.email });
  }
}

export default UsersController;
