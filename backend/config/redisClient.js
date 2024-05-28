const { createClient } = require('redis');
const logger = require('../utils/logger');

let client;

const connectRedis = async () => {
  if (!client) {
    client = createClient({
      url: process.env.REDIS_URL,
      retry_strategy: (options) => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
          return undefined;
        }
        return Math.min(options.attempt * 100, 3000);
      }
    });

    client.on('error', (err) => {
      logger.error(`Redis error: ${err.message}`);
    });

    client.on('connect', () => {
      logger.info('Connected to Redis');
    });

    client.on('ready', () => {
      logger.info('Redis client is ready');
    });

    client.on('end', () => {
      logger.info('Redis connection closed');
    });

    try {
      await client.connect();
    } catch (err) {
      logger.error(`Failed to connect to Redis: ${err.message}`);
      throw err;
    }
  }
  return client;
};

module.exports = { connectRedis };
