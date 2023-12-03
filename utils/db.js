const mongodb = require('mongodb'); // import mongodb from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    const uri = `mongodb://${host}:${port}/${database}`;

    // Initialize MongoDB client with the specified URI and options
    this.client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Connect to MongoDB
    this.client.connect();
  }

  //  returns true when the connection to MongoDB is a success otherwise, false
  isAlive() {
    return this.client.isConnected();
  }

  // an asynchronous function nbUsers that returns the number of documents in the collection users

  async nbUsers() {
    const collection = this.client.db().collection('users');
    const count = await collection.countDocuments();
    return count;
  }

  // an asynchronous function nbFiles that returns the number of documents in the collection files
  async nbFiles() {
    const collection = this.client.db().collection('files');
    const count = await collection.countDocuments();
    return count;
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
