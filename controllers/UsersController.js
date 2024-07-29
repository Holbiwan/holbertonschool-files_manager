import { ObjectId } from 'mongodb';
import sha1 from 'sha1';
import Queue from 'bull';
import dbClient from '../utils/db';

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
      console.log(email);
      if (!email) {
        return response.status(400).json({ error: 'Missing email' });
      }

      if (!password) {
        return response.status(400).json({ error: 'Missing password' });
      }

      const emailExists = await dbClient.getUser({email})

      if (emailExists) {
        return response.status(400).json({ error: 'Already exist' });
      }

      const sha1Password = sha1(password);

      const result = await dbClient.db.collection("user").insertOne({
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

}

export default UsersController;