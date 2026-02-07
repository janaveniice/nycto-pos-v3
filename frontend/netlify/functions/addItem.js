import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
let cachedClient = null;

export async function handler(event) {
  try {
    if (!cachedClient) {
      cachedClient = new MongoClient(uri);
      await cachedClient.connect();
    }

    const db = cachedClient.db("catalog");
    const collection = db.collection("price_list");

    // Parse incoming JSON body
    const item = JSON.parse(event.body);

    // Insert the new item
    const result = await collection.insertOne(item);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Item added successfully",
        itemId: result.insertedId,
      }),
      headers: { "Content-Type": "application/json" },
    };
  } catch (err) {
    console.error("Failed to add item:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to add item",
        details: err.message,
      }),
      headers: { "Content-Type": "application/json" },
    };
  }
}
