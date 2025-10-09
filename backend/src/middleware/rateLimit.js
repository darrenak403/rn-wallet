import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    //userId, IP address, API key
    //here we just kept it simple and use a static key
    //in a real-world-app you'd like to put the userId or IP address here
    const {success} = await ratelimit.limit(`User id ${req.ip}`);

    if (!success) {
      return res
        .status(429)
        .json({status: "429", message: "Too many requests"});
    }

    next();
  } catch (error) {
    console.log("Rate limit error", error);
    next(error);
  }
};

export default rateLimiter;
