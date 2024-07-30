import { ObjectId } from 'mongodb';
import sha1 from 'sha1';
import Queue from 'bull';
import dbClient from '../utils/db';
import userUtils from '../utils/user';

const userQueue = new Queue('userQueue');

class UsersController {
  /**
   * Creates a user using email and password
   * To create a user, you must specify an email and a password.
   * @param {Object} request - The request object
   * @param {Object} response - The response object
   * @returns {Object} - Returns the newly created user with status code 201
   */
  static async postNew(request, response) {
    try {
      const { email, password } = request.body;

      if (!email) {
        return response.status(400).json({ error: 'Missing email' });
      }

      if (!password) {
        return response.status(400).json({ error: 'Missing password' });
      }

      const emailExists = await dbClient.usersCollection.findOne({ email });

      if (emailExists) {
        return response.status(400).json({ error: 'Already exist' });
      }

      const sha1Password = sha1(password);

      const result = await dbClient.usersCollection.insertOne({
        email,
        password: sha1Password,
      });

      const user = {
        id: result.insertedId,
        email,
      };

      await userQueue.add({
        userId: result.insertedId.toString(),
      });

      return response.status(201).json(user);
    } catch (err) {
      console.error('Error creating user:', err);
      return response.status(500).json({ error: 'Error creating user' });
    }
  }

  /**
   * Retrieves the authenticated user based on the token
   * @param {Object} request - The request object
   * @param {Object} response - The response object
   * @returns {Object} - Returns the user object (email and id only) with status code 200
   */
  static async getMe(request, response) {
    try {
      const { userId } = await userUtils.getUserIdAndKey(request);

      const user = await userUtils.getUser({ _id: ObjectId(userId) });

      if (!user) {
        return response.status(401).json({ error: 'Unauthorized' });
      }

      const processedUser = { id: user._id, email: user.email };
      return response.status(200).json(processedUser);
    } catch (err) {
      console.error('Error retrieving user:', err);
      return response.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default UsersController;
