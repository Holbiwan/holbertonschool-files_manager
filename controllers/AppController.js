import RedisClient from '../utils/redis';
import DBClient from '../utils/db';

class AppController {
  /**
   * Get the status of Redis and MongoDB clients
   * @param {Object} request - The request object
   * @param {Object} response - The response object
   */
  static getStatus(req, res) {
    const status = {
      redis: RedisClient.isAlive(),
      db: DBClient.isAlive(),
    };
    res.status(200).json(status);
  }

  /**
   * Get the statistics of users and files in the database
   * @param {Object} request - The request object
   * @param {Object} response - The response object
   */
  static async getStats(req, res) {
    try {
      const [users, files] = await Promise.all([
        DBClient.nbUsers(),
        DBClient.nbFiles(),
      ]);
      const stats = { users, files };
      res.status(200).json(stats);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default AppController;
