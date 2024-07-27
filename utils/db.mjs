import { MongoClient } from 'mongodb';

// Define default MongoDB connection parameters
const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017;
const database = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${host}:${port}/`;

class DBClient {
  constructor() {
    this.db = null;
    // Connect to MongoDB and initialize the database connection
    MongoClient.connect(url, { useUnifiedTopology: true }, (error, client) => {
      if (error) {
        console.log('MongoDB connection error:', error);
        return;
      }
      this.db = client.db(database);
      // Ensure necessary collections exist
      (async () => {
        try {
          const collections = await this.db.listCollections().toArray();
          const collectionNames = collections.map((col) => col.name);

          // Create 'users' collection if it doesn't exist
          if (!collectionNames.includes('users')) {
            await this.db.createCollection('users');
          }

          // Create 'files' collection if it doesn't exist
          if (!collectionNames.includes('files')) {
            await this.db.createCollection('files');
          }
        } catch (err) {
          console.error('Error initializing collections:', err);
        }
      })();
    });
  }

  isAlive() {
    // Return true if the database connection is active
    return !!this.db;
  }

  async nbUsers() {
    // Retrieve and return the total number of users
    return this.db.collection('users').countDocuments();
  }

  async getUser(query) {
    // Fetch a single user based on the query
    console.log('QUERY IN DB.JS', query);
    const user = await this.db.collection('users').findOne(query);
    console.log('GET USER IN DB.JS', user);
    return user;
  }

  async nbFiles() {
    // Retrieve and return the total number of files
    return this.db.collection('files').countDocuments();
  }

  async saveFile(fileData) {
    // Save new file data into the database
    const result = await this.db.collection('files').insertOne(fileData);
    return { _id: result.insertedId, ...fileData };
  }
}

// Export a singleton instance of DBClient, ensuring only one instance is used
export default new DBClient();
