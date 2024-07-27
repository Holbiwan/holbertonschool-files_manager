import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    this.host = process.env.DB_HOST || 'localhost';
    this.port = process.env.DB_PORT || 27017;
    this.database = process.env.DB_DATABASE || 'files_manager';
    this.url = `mongodb://${this.host}:${this.port}`;
    this.client = new MongoClient(this.url, { useUnifiedTopology: true });
    this.db = null;
  }

  async connect() {
    await this.client.connect();
    this.db = this.client.db(this.database);
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    return await this.db.collection('users').countDocuments();
  }

  async nbFiles() {
    return await this.db.collection('files').countDocuments();
  }
}

const dbClient = new DBClient();
// Ensure that the dbClient is connected before exporting
await dbClient.connect();

export default dbClient;
