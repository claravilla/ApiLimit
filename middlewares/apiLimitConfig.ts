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
      rate: 4,
      time: 60,
    },
    authenticated: {
      rate: 6,
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
