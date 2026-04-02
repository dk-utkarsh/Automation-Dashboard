import { getSql } from "../lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  try {
    const sql = getSql();
    const result = await sql`
      SELECT t.*, d.name AS department_name, d.slug AS department_slug
      FROM tools t
      JOIN departments d ON d.id = t.department_id
      WHERE t.id = ${id}
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: "Tool not found" });
    }

    return res.status(200).json(result[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
