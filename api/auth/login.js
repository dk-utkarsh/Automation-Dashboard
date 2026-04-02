import { getSql } from "../lib/db.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Simple token store (in production, use a proper session store)
const sessions = globalThis._sessions || (globalThis._sessions = new Map());

export { sessions };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Username and password are required" });

  try {
    const sql = getSql();
    const users = await sql`SELECT * FROM admin_users WHERE username = ${username}`;
    if (users.length === 0) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, users[0].password_hash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = crypto.randomBytes(32).toString("hex");
    sessions.set(token, { userId: users[0].id, username: users[0].username });

    res.json({ token, username: users[0].username });
  } catch (err) { res.status(500).json({ error: err.message }); }
}
