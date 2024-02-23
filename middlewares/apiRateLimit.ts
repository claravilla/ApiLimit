import { Request, Response } from "express";
import requestIp from "request-ip";
import { createClient } from "redis";
import { apiRateLimits, RateLimitType } from "./apiLimitConfig";

const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_URL,
    port: 19355,
  },
});

client.on("error", (err) => console.log("Redis Client Error", err));

export default async (req: Request, res: Response, next: Function) => {
  const route = req.originalUrl.slice(1);
  const clientIp = requestIp.getClientIp(req);
  if (!clientIp || !checkPathHasLimits(route)) {
    next();
  } else {
    await client.connect();
    const authStatus = authStatusCheck(req.header);
    const { rate, time } = getRateLimit(route, authStatus);
    const recordKey = `${route}:${clientIp}:${authStatus}`;
    const totalCalls = await checkNumberOfCalls(recordKey);
    const currentTime = new Date().getTime() / 1000;
    const currentCalls = totalCalls.filter((call) => {
      return Number(call) > currentTime - time;
    });
    if (currentCalls.length <= rate) {
      createAndUpdateRecord(recordKey, currentTime.toString());
      await client.quit();
      next();
    } else {
      await client.quit();
      res.status(429).send("Too many request");
    }
  }
};

const checkPathHasLimits = (path: string): boolean => {
  if (!apiRateLimits[path]) {
    return false;
  }
  return true;
};

const authStatusCheck = (header: any): string => {
  if (!header["x-api-key"] || header["x-api-key"] !== process.env.API_KEY) {
    return "anonymous";
  }
  return "authorised";
};
const getRateLimit = (path: string, authStatus: string): RateLimitType => {
  return apiRateLimits[path][authStatus];
};

const checkNumberOfCalls = async (key: string) => {
  const result = await client.sMembers(key);
  return result;
};

const createAndUpdateRecord = async (key: string, timeStamp: string) => {
  const result = await client.SADD(key, timeStamp);
};
