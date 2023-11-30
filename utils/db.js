// import mongodb from 'mongodb';
const mongodb = require('mongodb');

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    this.alive = false;

    const uri = `mongodb://${host}:${port}/${database}`;

    // Initialize MongoDB client with the specified URI and options
    this.client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Connect to MongoDB
    this.client.connect();
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    const collection = this.client.db().collection('users');
    const count = await collection.countDocuments();
    return count;
  }

  async nbFiles() {
    const collection = this.client.db().collection('files');
    const count = await collection.countDocuments();
    return count;
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
