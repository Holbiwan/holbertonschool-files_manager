import dbClient from '../utils/db.js';
import redisClient from '../utils/redis.js';

class AppController {
  static getStatus(req, res) {
    const redis = redisClient.isAlive();
    const db = DBClient.isAlive();
    res.status(200).send({ redis, db });
  }

  static async getStats(req, res) {
    const users = await DBClient.nbUsers();
    const files = await DBClient.nbFiles();
    res.status(200).send({ users, files });
  }
}

export default AppController;
