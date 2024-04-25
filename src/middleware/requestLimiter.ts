const { RateLimiterRedis } = require("rate-limiter-flexible");
const Redis = require("ioredis");
// It is recommended to process Redis errors and setup some reconnection strategy
const redisClient = new Redis({
  options: {
    enableOfflineQueue: false,
  },
});

const opts = {
  storeClient: redisClient,
  points: 10, // Number of points
  duration: 1, // Per second(s)
};

const rateLimiter = new RateLimiterRedis(opts);


const rateLimiterMiddleware = (req: any, res: any, next: any) => {
  rateLimiter
    .consume(req.connection.remoteAddress)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).send("Too Many Requests");
    });
};

export { rateLimiterMiddleware };
