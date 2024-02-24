import { NextFunction, Request, Response } from "express";
import {
  client,
  checkNumberOfCalls,
  createAndUpdateRecord,
} from "../utils/redis";
import { apiRateLimits, RateLimitType } from "./apiLimitConfig";

export const apiRateLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const route = req.originalUrl.slice(1);
    const clientIp = req.ip;
    if (!clientIp || !checkPathHasLimits(route)) {
      next();
    } else {
      await client.connect();
      const authStatus = authStatusCheck(req.headers);
      const { rate, time } = getRateLimit(route, authStatus);
      const recordKey = `${route}:${clientIp}:${authStatus}`;
      const { currentTime, numberOfCalls } = await checkNumberOfCalls(
        recordKey,
        time
      );

      if (numberOfCalls < rate) {
        createAndUpdateRecord(recordKey, currentTime.toString());
        await client.quit();
        next();
      } else {
        await client.quit();
        res.sendStatus(429);
      }
    }
  } catch (error) {
    next(error);
  }
};

const checkPathHasLimits = (path: string): boolean => {
  if (!apiRateLimits[path]) {
    return false;
  }
  return true;
};

const authStatusCheck = (headers: any): string => {
  if (!headers["x-api-key"] || headers["x-api-key"] !== process.env.API_KEY) {
    return "anonymous";
  }
  return "authenticated";
};
const getRateLimit = (path: string, authStatus: string): RateLimitType => {
  return apiRateLimits[path][authStatus];
};
