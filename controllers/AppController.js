const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

const AppController = {
  async getStatus(req, res) {
    // should return if Redis is alive and if the DB is alive too by using
    // the 2 utils created previously: { "redis": true, "db": true } with a status code 200
    const dbStatus = dbClient.isAlive();
    const redisStatus = redisClient.isAlive();
    // if ((dbStatus && redisStatus) === true) {
    // }

    res.status(200).json({ redis: redisStatus, db: dbStatus });
  },

  // should return the number of users and files in DB: { "users": 12, "files": 1231 }
  // with a status code 200
  async getStats(req, res) {
    try {
      const numUsers = await dbClient.nbUsers();
      const numFiles = await dbClient.nbFiles();

      res.status(200).json({ users: numUsers, files: numFiles });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
};

module.exports = AppController;
