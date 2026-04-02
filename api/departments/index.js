import { getSql } from "../lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const sql = getSql();
    const result = await sql`
      SELECT d.*, COUNT(t.id)::int AS tool_count
      FROM departments d
      LEFT JOIN tools t ON t.department_id = d.id
      GROUP BY d.id
      ORDER BY d.sort_order ASC, d.name ASC
    `;

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
