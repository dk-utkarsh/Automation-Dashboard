import { getSql } from "../../lib/db.js";

export default async function handler(req, res) {
  const { id } = req.query;
  const sql = getSql();

  if (req.method === "PUT") {
    const { name, icon, color, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    try {
      const result = await sql`
        UPDATE departments
        SET name = ${name}, slug = ${slug}, icon = ${icon || "📁"}, color = ${color || "#6366f1, #8b5cf6"}, description = ${description || ""}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;

      if (result.length === 0) {
        return res.status(404).json({ error: "Department not found" });
      }

      return res.status(200).json(result[0]);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "DELETE") {
    try {
      const result = await sql`DELETE FROM departments WHERE id = ${id} RETURNING *`;

      if (result.length === 0) {
        return res.status(404).json({ error: "Department not found" });
      }

      return res.status(200).json({ message: "Department deleted" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
