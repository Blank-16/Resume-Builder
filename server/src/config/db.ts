import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDB(): Promise<void> {
  // Configure Mongoose before connecting
  mongoose.set("strictQuery", true);

  // Reconnect automatically if the connection drops (Atlas may close idle connections)
  mongoose.connection.on("disconnected", () => {
    if (env.isDev) console.warn("[MongoDB] Disconnected — attempting reconnect…");
    void mongoose.connect(env.mongodbUri, connectionOptions);
  });

  mongoose.connection.on("error", (err) => {
    console.error("[MongoDB] Connection error:", err.message);
  });

  try {
    const conn = await mongoose.connect(env.mongodbUri, connectionOptions);
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("[MongoDB] Initial connection failed:", error);
    process.exit(1);
  }
}

const connectionOptions: mongoose.ConnectOptions = {
  // Give up after 5 s if the cluster is unreachable (fail fast during startup)
  serverSelectionTimeoutMS: 5000,
  // Keep a socket alive so Atlas doesn't close idle connections
  socketTimeoutMS: 45000,
};
