/**
 * @time expressed in seconds
 */

export interface RateLimitType {
  rate: number;
  time: number;
}

interface apiLimitConfigType {
  [key: string]: {
    [key: string]: RateLimitType;
  };
}

export const apiRateLimits: apiLimitConfigType = {
  home: {
    anonymous: {
      rate: 5,
      time: 60,
    },
    authenticated: {
      rate: 10,
      time: 60,
    },
  },
  articles: {
    anonymous: {
      rate: 25,
      time: 3600,
    },
    authenticated: {
      rate: 50,
      time: 3600,
    },
  },
};
