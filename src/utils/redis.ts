import { createClient } from "redis";

export const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_URL,
    port: 19355,
  },
});

client.on("error", (err: any) => {
  console.log("Redis Client Error", err);
  throw new Error(`Redis Client Error ${err}`);
});

export const checkNumberOfCalls = async (key: string, time: number) => {
  const totalCalls: string[] = await client.sMembers(key);
  const currentTime = new Date().getTime() / 1000;
  const oldCalls = totalCalls.filter((call) => {
    return Number(call) < currentTime - time;
  });
  if (oldCalls.length > 0) {
    await Promise.all(
      oldCalls.map(async (call) => {
        await client.sRem(key, call);
      })
    );
  }
  const currentCalls = totalCalls.filter((call) => {
    return Number(call) > currentTime - time;
  });

  return {
    numberOfCalls: currentCalls.length,
    currentTime,
  };
};

export const createAndUpdateRecord = async (key: string, timeStamp: string) => {
  await client.SADD(key, timeStamp);
};
