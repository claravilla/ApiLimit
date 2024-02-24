import { NextFunction, Request, Response } from "express";
import "dotenv/config";
import { apiRateLimit } from "../middlewares/apiRateLimit";
import { checkNumberOfCalls, createAndUpdateRecord } from "../utils/redis";

jest.mock("../utils/redis");

const checkNumberOfCallsMock = checkNumberOfCalls as jest.Mock;
const createAndUpdateRecordMock = createAndUpdateRecord as jest.Mock;

describe("Test api rate limit middleware", () => {
  let testReq: Partial<Request>;
  let testRes: Partial<Response>;
  let testNext: NextFunction = jest.fn();

  beforeEach(() => {
    testReq = {};
    testRes = {
      sendStatus: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it("should not block anonymous calls to the home url when the configured limit is not reached", async () => {
    testReq = {
      headers: {},
      originalUrl: "/home",
      ip: "127.1.0.0",
    };

    checkNumberOfCallsMock.mockResolvedValueOnce({
      numberOfCalls: 2,
      currentTime: 1708736687,
    });

    await apiRateLimit(testReq as Request, testRes as Response, testNext);

    expect(createAndUpdateRecordMock).toHaveBeenNthCalledWith(
      1,
      "home:127.1.0.0:anonymous",
      "1708736687"
    );
    expect(testNext).toHaveBeenCalledTimes(1);
  });

  it("should not block authenticated calls to the home url when the configured limit is not reached", async () => {
    testReq = {
      headers: {
        "x-api-key": process.env.API_KEY,
      },
      originalUrl: "/home",
      ip: "127.1.0.0",
    };

    checkNumberOfCallsMock.mockResolvedValueOnce({
      numberOfCalls: 6,
      currentTime: 1708736687,
    });

    await apiRateLimit(testReq as Request, testRes as Response, testNext);

    expect(createAndUpdateRecordMock).toHaveBeenNthCalledWith(
      1,
      "home:127.1.0.0:authenticated",
      "1708736687"
    );
    expect(testNext).toHaveBeenCalledTimes(1);
  });

  it("should block anonymous calls to the home url when the configured limit is reached", async () => {
    testReq = {
      headers: {},
      originalUrl: "/home",
      ip: "127.1.0.0",
    };

    checkNumberOfCallsMock.mockResolvedValueOnce({
      numberOfCalls: 7,
      currentTime: 1708736687,
    });

    await apiRateLimit(testReq as Request, testRes as Response, testNext);

    expect(createAndUpdateRecordMock).toHaveBeenCalledTimes(0);
    expect(testRes.sendStatus).toHaveBeenCalledWith(429);
  });

  it("should block authenticated calls to the home url when the configured limit is reached", async () => {
    testReq = {
      headers: {
        "x-api-key": process.env.API_KEY,
      },
      originalUrl: "/home",
      ip: "127.1.0.0",
    };

    checkNumberOfCallsMock.mockResolvedValueOnce({
      numberOfCalls: 11,
      currentTime: 1708736687,
    });

    await apiRateLimit(testReq as Request, testRes as Response, testNext);

    expect(createAndUpdateRecordMock).toHaveBeenCalledTimes(0);
    expect(testRes.sendStatus).toHaveBeenCalledWith(429);
  });

  it("should block authenticated calls with the wrong API key to the home url when the configured limit for anonymous is reached", async () => {
    testReq = {
      headers: {
        "x-api-key": '"wrong key',
      },
      originalUrl: "/home",
      ip: "127.1.0.0",
    };

    checkNumberOfCallsMock.mockResolvedValueOnce({
      numberOfCalls: 7,
      currentTime: 1708736687,
    });

    await apiRateLimit(testReq as Request, testRes as Response, testNext);

    expect(createAndUpdateRecordMock).toHaveBeenCalledTimes(0);
    expect(testRes.sendStatus).toHaveBeenCalledWith(429);
  });

  it("should not checks calls to the contacts url", async () => {
    testReq = {
      headers: {},
      originalUrl: "/contacts",
      ip: "127.1.0.0",
    };
    await apiRateLimit(testReq as Request, testRes as Response, testNext);
    expect(checkNumberOfCallsMock).toHaveBeenCalledTimes(0);
    expect(testNext).toHaveBeenCalledTimes(1);
  });

  it("should not checks calls if there is no IP address in the request", async () => {
    testReq = {
      headers: {},
      originalUrl: "/home",
    };
    await apiRateLimit(testReq as Request, testRes as Response, testNext);
    expect(checkNumberOfCallsMock).toHaveBeenCalledTimes(0);
    expect(testNext).toHaveBeenCalledTimes(1);
  });
});
