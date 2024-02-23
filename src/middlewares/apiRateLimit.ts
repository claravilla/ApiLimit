import { NextFunction, Request, Response } from "express";
import requestIp from "request-ip";
import {
  client,
  checkNumberOfCalls,
  createAndUpdateRecord,
} from "../utils/redis";
import getCurrentTime from "../utils/getCurrentTime";
import { apiRateLimits, RateLimitType } from "./apiLimitConfig";

export const apiRateLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    const currentTime = getCurrentTime();
    const currentCalls = totalCalls.filter((call) => {
      return Number(call) > currentTime - time;
    });
    if (currentCalls.length <= rate) {
      createAndUpdateRecord(recordKey, currentTime.toString());
      await client.quit();
      next();
    } else {
      await client.quit();
      res.status(429).send("Too many requests");
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
