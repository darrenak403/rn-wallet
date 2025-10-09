import {Redis} from "@upstash/redis";
import {Ratelimit} from "@upstash/ratelimit";
import "dotenv/config.js";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "10 m"), // 100 requests per 10 minutes
});

export default ratelimit;
