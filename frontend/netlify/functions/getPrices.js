import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
let cachedClient = null;

export async function handler() {
  try {
    if (!cachedClient) {
      cachedClient = new MongoClient(uri);
      await cachedClient.connect();
    }

    const db = cachedClient.db("catalog");
    const items = await db.collection("price_list").find({}).toArray();

    return {
      statusCode: 200,
      body: JSON.stringify(items),
      headers: { "Content-Type": "application/json" },
    };
  } catch (err) {
    console.error("Failed to fetch prices:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to fetch prices",
        details: err.message,
      }),
      headers: { "Content-Type": "application/json" },
    };
  }
}
