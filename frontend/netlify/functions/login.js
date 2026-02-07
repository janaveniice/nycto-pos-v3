import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const uri = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
let client;

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { email, password } = JSON.parse(event.body);

    if (!client) {
      client = new MongoClient(uri);
      await client.connect();
    }

    const db = client.db("catalog");
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid credentials" })
      };
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid credentials" })
      };
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return {
      statusCode: 200,
      headers: {
        "Set-Cookie": `token=${token}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=604800`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        success: true,
        user: { email: user.email, role: user.role }
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Login failed" })
    };
  }
}
