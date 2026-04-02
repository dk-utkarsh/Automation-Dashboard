import { sessions } from "./login.js";

export default function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const token = req.headers.authorization?.replace("Bearer ", "");
  const session = token && sessions.get(token);
  if (!session) return res.status(401).json({ error: "Not authenticated" });
  res.json({ username: session.username });
}
