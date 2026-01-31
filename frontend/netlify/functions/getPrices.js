import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI; // Make sure .env has MONGO_URI, not MONGODB_URI
let cachedClient = null;

export default async function handler() {
  try {
    if (!cachedClient) {
      cachedClient = new MongoClient(uri);
      await cachedClient.connect();
    }

    const db = cachedClient.db("catalog");
    const items = await db.collection("price_list").find({}).toArray();

    return new Response(JSON.stringify(items), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch prices", details: err.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
