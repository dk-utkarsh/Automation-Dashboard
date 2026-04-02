import { getSql } from "../../lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { department_id, name, description, url, icon, status, tags } = req.body;

  if (!name || !url || !department_id) {
    return res.status(400).json({ error: "department_id, name, and url are required" });
  }

  try {
    const sql = getSql();
    const maxOrder = await sql`SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order FROM tools WHERE department_id = ${department_id}`;
    const sortOrder = maxOrder[0].next_order;

    const tagsArray = Array.isArray(tags) ? tags : [];

    const result = await sql`
      INSERT INTO tools (department_id, name, description, url, icon, status, tags, sort_order)
      VALUES (${department_id}, ${name}, ${description || ""}, ${url}, ${icon || "🔧"}, ${status || "live"}, ${tagsArray}, ${sortOrder})
      RETURNING *
    `;

    return res.status(201).json(result[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
