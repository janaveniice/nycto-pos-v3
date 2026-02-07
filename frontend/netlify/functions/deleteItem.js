import { MongoClient, ObjectId } from "mongodb";

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

    // Parse the incoming JSON body
    const { _id } = JSON.parse(event.body);

    if (!_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "_id is required to delete an item" }),
        headers: { "Content-Type": "application/json" },
      };
    }

    const result = await collection.deleteOne({ _id: new ObjectId(_id) });

    if (result.deletedCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Item not found" }),
        headers: { "Content-Type": "application/json" },
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Item deleted successfully" }),
      headers: { "Content-Type": "application/json" },
    };
  } catch (err) {
    console.error("Failed to delete item:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to delete item",
        details: err.message,
      }),
      headers: { "Content-Type": "application/json" },
    };
  }
}
