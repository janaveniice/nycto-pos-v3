import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI; // set this in Netlify > Site settings > Environment variables
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

    // add timestamp
    order.timestamp = new Date().toISOString();

    if (!cachedClient) {
      cachedClient = new MongoClient(uri);
      await cachedClient.connect();
    }

    const db = cachedClient.db("catalog");
    const collection = db.collection("orders");

    const result = await collection.insertOne(order);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        insertedId: result.insertedId,
      }),
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
