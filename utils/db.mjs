import { MongoClient } from 'mongodb';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${DB_HOST}:${DB_PORT}`;

class DBClient {
  constructor() {
    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.client.connect()
      .then((client) => {
        this.db = client.db(DB_DATABASE);
        this.usersCollection = this.db.collection('users');
        this.filesCollection = this.db.collection('files');
        console.log('MongoDB client connected to the server');
      })
      .catch((err) => {
        console.log(`MongoDB client not connected to the server: ${err.message}`);
        this.db = false;
      });
  }

  isAlive() {
    return !!this.db;
  }

  async nbUsers() {
    if (!this.isAlive()) {
      throw new Error('MongoDB client is not connected');
    }
    return this.usersCollection.countDocuments();
  }

  async nbFiles() {
    if (!this.isAlive()) {
      throw new Error('MongoDB client is not connected');
    }
    return this.filesCollection.countDocuments();
  }
}

const dbClient = new DBClient();

export default dbClient;
