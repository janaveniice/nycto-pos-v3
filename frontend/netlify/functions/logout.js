export async function handler() {
  return {
    statusCode: 200,
    headers: {
      "Set-Cookie": `token=; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=0`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ success: true }),
  };
}