import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
let cachedClient = null;

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const order = JSON.parse(event.body);

    // Add timestamp if not already present
    if (!order.timestamp) {
      order.timestamp = new Date().toISOString();
    }

    // Connect to MongoDB (reusing cached client if possible)
    if (!cachedClient) {
      cachedClient = new MongoClient(uri);
      await cachedClient.connect();
    }

    const db = cachedClient.db("catalog"); // database name
    const collection = db.collection("orders"); // collection name

    const result = await collection.insertOne(order);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, insertedId: result.insertedId }),
    };
  } catch (err) {
    console.error("Failed to insert order:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to create order",
        details: err.message,
      }),
    };
  }
}
