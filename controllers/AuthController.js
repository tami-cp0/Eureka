import sha1 from 'sha1';
import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import cache from '../db/cache.js';
import DB from '../db/db.js';

class AuthController {
  static async connect(req, res, next) {
    const { email, password } = req.body;

    const sha1Password = sha1(password);

    try {
      const user = await DB.User.findOne({ email, password: sha1Password });
      if (!user) {
        const error = { message: 'Email or Password is invalid' };
        return res.status(401).render('login', { error });
      }

      const token = uuidv4();
      const authToken = `auth_${token}`;
      const duration = 24 * 3600;

      // Store the user ID in Redis with the auth token as the key
      const userId = user._id.toString();
      await cache.set(authToken, userId, duration);
      return next();
    } catch (err) {
      console.log(err);
      const error = { message: '500 Internal server error' };
      return res.status(401).render('login', { error });
    }
  }

  static async getDisconnect(req, res) {
    // Retrieve token from request headers
    const token = req.get('X-Token');

    // Get user ID from Redis using token
    const id = new ObjectId(await redisClient.get(`auth_${token}`));
    if (!id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // ensure id is linked to a real user
    const user = await dbClient.users.findOne({ _id: id });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await redisClient.del(`auth_${token}`);
    return res.status(204).send();
  }
}

export default AuthController;
