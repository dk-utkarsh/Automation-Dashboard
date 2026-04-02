import { getSql } from "../../lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, icon, color, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  try {
    const sql = getSql();
    const maxOrder = await sql`SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order FROM departments`;
    const sortOrder = maxOrder[0].next_order;

    const result = await sql`
      INSERT INTO departments (name, slug, icon, color, description, sort_order)
      VALUES (${name}, ${slug}, ${icon || "📁"}, ${color || "#6366f1, #8b5cf6"}, ${description || ""}, ${sortOrder})
      RETURNING *
    `;

    return res.status(201).json(result[0]);
  } catch (error) {
    if (error.message.includes("unique")) {
      return res.status(409).json({ error: "Department with this name already exists" });
    }
    return res.status(500).json({ error: error.message });
  }
}
