const sha1 = require('sha1');
const { ObjectID } = require('mongodb');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

const UsersController = {
  async postNew(req, res) {
    try {
      const { email, password } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Missing email' });
      }

      if (!password) {
        return res.status(400).json({ error: 'Missing password' });
      }

      // Check if email already exists in the database
      const userExists = await dbClient.client.db().collection('users').findOne({ email });
      if (userExists) {
        return res.status(400).json({ error: 'Already exist' });
      }

      // Hash the password using SHA1
      const hashedPassword = sha1(password);

      // Insert new user into the 'users' collection
      const insertUserResult = await dbClient.client
        .db()
        .collection('users')
        .insertOne({ email, password: hashedPassword });
      // const result = await dbClient.client.db().collection('users')
      // .insertOne({ email, password: hashedPassword });

      // Return the new user data
      const newUser = { id: insertUserResult.insertedId, email };
      return res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async getMe(req, res) {
    const token = req.headers['x-token'];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const key = `auth_${token}`;
    const userIdFromRedis = await redisClient.get(key);

    if (!userIdFromRedis) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userIdforMongo = new ObjectID(userIdFromRedis);

    const user = await dbClient.client.db().collection('users').findOne({ _id: userIdforMongo });
    if (!user) {
      // console.log('fiallled');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    return res.json({ id: user._id, email: user.email });
  },

};

module.exports = UsersController;
