import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

export const connectDbClient = async () => {
  return await new MongoClient(uri).connect();
};
