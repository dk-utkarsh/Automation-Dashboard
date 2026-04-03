import { getSql } from "../../lib/db.js";

export default async function handler(req, res) {
  const { id } = req.query;
  const sql = getSql();

  if (req.method === "PUT") {
    const { name, description, url, icon, status, tags, managed_by } = req.body;

    if (!name || !url) {
      return res.status(400).json({ error: "Name and URL are required" });
    }

    const tagsArray = Array.isArray(tags) ? tags : [];

    try {
      const result = await sql`
        UPDATE tools
        SET name = ${name}, description = ${description || ""}, url = ${url}, icon = ${icon || "🔧"}, status = ${status || "live"}, tags = ${tagsArray}, managed_by = ${managed_by || ""}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;

      if (result.length === 0) {
        return res.status(404).json({ error: "Tool not found" });
      }

      return res.status(200).json(result[0]);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "DELETE") {
    try {
      const result = await sql`DELETE FROM tools WHERE id = ${id} RETURNING *`;

      if (result.length === 0) {
        return res.status(404).json({ error: "Tool not found" });
      }

      return res.status(200).json({ message: "Tool deleted" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
