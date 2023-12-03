import { promisify } from 'util';

const redis = require('redis');

class RedisClient {
  /**
     * Creates a new RedisClient instance.
     */
  constructor() {
    const client = redis.createClient();
    this.clientConnectStats = true;
    client.on('error', (err) => {
      console.log(`Redis conection error ${err}`);
      this.clientConnectStats = false;
    });
    this.client = client;
  }

  /**
     * Checks if this client's connection to the Redis server is active.
     * @returns {boolean}
     */
  isAlive() {
    return this.clientConnectStats;
  }

  // @param {key string}, return stored value
  async get(key) {
    return promisify(this.client.get).bind(this.client)(key);
  }

  // @params key, value, time duration, stores a key: value with an expiration time
  async set(key, val, duration) {
    await promisify(this.client.SETEX).bind(this.client)(key, duration, val);
  }

  // an asynchronous function del that takes a string key as argument and remove the
  // value in Redis for this key
  async del(key) {
    await promisify(this.client.del).bind(this.client)(key);
  }
}

const redisClient = new RedisClient();

module.exports = redisClient;
// export default redisClient;
