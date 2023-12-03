const sha1 = require('sha1');
const { v4: uuidv4 } = require('uuid');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

const AuthController = {
  async getConnect(req, res) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).send('Unauthorized request');
    }

    // console.log(authHeader); // coding test: was successful
    // return res.status(200).send('SuccesS'); // coding test: was successful

    // remove the 'Basic' part of the Base64 encode string
    const encodedCredential = authHeader.split(' ')[1];
    // console.log(encodedCredential); // : test sucessful

    // Decode the Base64 string to get the email and password
    const decodedCredentials = Buffer.from(encodedCredential, 'base64').toString('utf-8');
    // console.log(decodedCredentials); // : test sucessful

    const [email, password] = decodedCredentials.split(':');

    const hashedPassword = sha1(password);

    const user = await dbClient.client.db().collection('users').findOne({ email, password: hashedPassword });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = uuidv4();
    const key = `auth_${token}`;

    await redisClient.set(key, user._id.toString(), 86400);
    // await redisClient.client.set(key, user._id.toString(), 'EX', 24 * 60 * 60); // works too

    return res.status(200).json({ token });
  },

  async getDisconnect(req, res) {
    const token = req.headers['x-token'];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const key = `auth_${token}`;
    const redisUserId = await redisClient.get(key);

    if (!redisUserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await redisClient.del(key);
    return res.status(204).json({});
  },

};

module.exports = AuthController;
