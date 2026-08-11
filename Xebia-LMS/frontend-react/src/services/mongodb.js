import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

let client;
let clientPromise;

if (uri) {
  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
} else {
  // Return a rejected promise instead of throwing a top-level error during compilation
  clientPromise = Promise.reject(new Error("Please add your Mongo URI to environment variables."));
}

export default clientPromise;
