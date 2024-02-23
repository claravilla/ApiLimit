import { createClient } from "redis";

export const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_URL,
    port: 19355,
  },
});

client.on("error", (err) => console.log("Redis Client Error", err));

export const checkNumberOfCalls = async (key: string) => {
  const result = await client.sMembers(key);
  return result;
};

export const createAndUpdateRecord = async (key: string, timeStamp: string) => {
  await client.SADD(key, timeStamp);
};
