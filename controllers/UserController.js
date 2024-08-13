import sha1 from 'sha1';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) return res.status(400).send({ error: 'Missing email' });

    if (!password) { return res.status(400).send({ error: 'Missing password' }); }

    const emailExists = await dbClient.users.findOne({ email });

    if (emailExists) { return res.status(400).send({ error: 'Already exist' }); }

    const sha1Password = sha1(password);

    let result;
    try {
      result = await dbClient.users.insertOne({
        email,
        password: sha1Password,
      });
    } catch (err) {
      return res.status(500).send({ error: 'Error creating user.' });
    }

    const user = {
      id: result.insertedId,
      email,
    };

    return res.status(201).send(user);
  }

  static async getMe(req, res) {
    const token = req.get('X-Token');
    const id = new ObjectId(await redisClient.get(`auth_${token}`));
    if (!id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await dbClient.users.findOne({ _id: id });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    return res.status(200).json({ id, email: user.email });
  }
}

export default UsersController;
