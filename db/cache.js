import { config } from 'dotenv';
import { createClient } from 'redis';

config({ path: '.env' }); // Load environment variables

class RedisClient {
  /**
   * Creates an instance of RedisClient and initializes connection.
   * @constructor
   */
  constructor() {
    this.initialize();
  }

  /**
   * Initializes the Redis client and attempts to connect.
   * Sets `this.alive` to true if connected successfully.
   * @returns {Promise<void>}
   */
  async initialize() {
    this.client = createClient({
      password: process.env.REDIS_PASS,
      socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
      }
    });

    try {
      await this.client.connect();
      console.log('Redis is connected');
    } catch (err) {
      console.error('Failed to connect to Redis:', err);
    }

    this.alive = this.client.isReady;
  }

  getClient() {
    // provide the client to RedisStore for managing
    return this.client;
  }
}

const cache = new RedisClient();
export default cache;
