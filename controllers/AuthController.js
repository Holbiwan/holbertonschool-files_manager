import { v4 as uuidv4 } from 'uuid';
import sha1 from 'sha1';
import redisClient from '../utils/redis';
import userUtils from '../utils/user';

class AuthController {
  /**
   * Signs in the user by generating a new authentication token
   * Uses Basic auth (Base64 of <email>:<password>) to authenticate the user
   * @param {Object} request - The request object
   * @param {Object} response - The response object
   * @returns {Object} - Returns a JSON object with the token and status code
   */
  static async getConnect(request, response) {
    try {
      const Authorization = request.header('Authorization') || '';
      const credentials = Authorization.split(' ')[1];

      if (!credentials) {
        return response.status(401).json({ error: 'Unauthorized' });
      }

      const decodedCredentials = Buffer.from(credentials, 'base64').toString('utf-8');
      const [email, password] = decodedCredentials.split(':');

      if (!email || !password) {
        return response.status(401).json({ error: 'Unauthorized' });
      }

      const sha1Password = sha1(password);
      const user = await userUtils.getUser({ email, password: sha1Password });

      if (!user) {
        return response.status(401).json({ error: 'Unauthorized' });
      }

      const token = uuidv4();
      const key = `auth_${token}`;
      const hoursForExpiration = 24;

      await redisClient.set(key, user._id.toString(), hoursForExpiration * 3600);

      return response.status(200).json({ token });
    } catch (error) {
      console.error('Error during authentication:', error);
      return response.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * Signs out the user based on the provided token
   * Deletes the token in Redis
   * @param {Object} request - The request object
   * @param {Object} response - The response object
   * @returns {void}
   */
  static async getDisconnect(request, response) {
    try {
      const { userId, key } = await userUtils.getUserIdAndKey(request);

      if (!userId) {
        return response.status(401).json({ error: 'Unauthorized' });
      }

      await redisClient.del(key);
      return response.status(204).send();
    } catch (error) {
      console.error('Error during sign out:', error);
      return response.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default AuthController;
