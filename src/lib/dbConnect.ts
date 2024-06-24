import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

export default async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("DB is Already connected!");
    return;
  }
  try {
    const db = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
    );
    connection.isConnected = db.connections[0].readyState;
    console.log("Mongo Db is Connected!");
  } catch (error) {
    console.log("Mongo Db connection failed!", error);
    process.exit(1);
  }
}
