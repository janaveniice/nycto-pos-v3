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
    const item = JSON.parse(event.body);

    if (!item._id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "_id is required for update" }),
        headers: { "Content-Type": "application/json" },
      };
    }

    const { _id, ...updateFields } = item;

    // Update the item
    const result = await collection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Item not found" }),
        headers: { "Content-Type": "application/json" },
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Item updated successfully" }),
      headers: { "Content-Type": "application/json" },
    };
  } catch (err) {
    console.error("Failed to update item:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to update item",
        details: err.message,
      }),
      headers: { "Content-Type": "application/json" },
    };
  }
}
