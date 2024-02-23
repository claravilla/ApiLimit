import { NextFunction, Request, Response } from "express";
import { apiRateLimit } from "../middlewares/apiRateLimit";
import {
  client,
  checkNumberOfCalls,
  createAndUpdateRecord,
} from "../utils/redis";

jest.mock("../middlewares/redisUtil");

const checkNumberOfCallsMock = checkNumberOfCalls as jest.Mock;
const createAndUpdateRecordMock = createAndUpdateRecord as jest.Mock;

describe("Test api rate limit middleware", () => {
  let testReq: Partial<Request>;
  let testRes: Partial<Response>;
  let next: NextFunction = jest.fn();

  beforeEach(() => {
    testReq = {};
    testRes = {
      json: jest.fn(),
    };
  });

  it("should not block anonymous calls to the home url when the configured limit is not reached", async () => {});

  it("should not block authenticated calls to the home url when the configured limit is not reached", async () => {});

  it.only("should block anonymous calls to the home url when the configured limit is reached", async () => {
    const testReq = {
      originalUrl: "/home",
    };

    const expectedRes = {
      status: 429,
      message: "Too many request",
    };

    checkNumberOfCallsMock.mockResolvedValueOnce([]);

    await apiRateLimit(testReq as Request, testRes as Response, next);

    expect(createAndUpdateRecordMock).toHaveBeenCalledTimes(0);
    expect(testRes.json).toHaveBeenCalledWith(expectedRes);
  });

  it("should block authenticated calls to the home url when the configured limit is reached", async () => {});

  it("should block authenticated calls with the wrong API key to the home url when the configured limit for anonymous is reached", async () => {});

  it("should not block calls to the contacts url", async () => {});
});
