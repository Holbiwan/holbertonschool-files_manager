import { v4 as uuidv4 } from 'uuid';
import sha1 from 'sha1';
import redisClient from '../utils/redis.js';
import dbClient from '../utils/db';

class AuthController {
  static async getConnect(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');

    const user = await dbClient.db.collection('users').findOne({
      email,
      password: sha1(password),
    });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = uuidv4();
    try {
      await redisClient.set(`auth_${token}`, user._id.toString(), 86400);
      return res.status(200).json({ token });
    } catch (error) {
      console.error(`Redis error: ${error}`);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default AuthController;
