import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function verifyAuth(event) {
  const cookie = event.headers.cookie || "";
  const token = cookie.split("token=")[1];

  if (!token) throw new Error("No token");

  return jwt.verify(token, JWT_SECRET);
}

export async function handler(event) {
  try {
    verifyAuth(event);
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    };
  } catch {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Unauthorized" })
    };
  }
}
