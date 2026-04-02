import { getSql } from "../../lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { orderedIds } = req.body;

  if (!Array.isArray(orderedIds)) {
    return res.status(400).json({ error: "orderedIds array is required" });
  }

  try {
    const sql = getSql();
    for (let i = 0; i < orderedIds.length; i++) {
      await sql`UPDATE tools SET sort_order = ${i + 1}, updated_at = NOW() WHERE id = ${orderedIds[i]}`;
    }

    return res.status(200).json({ message: "Reordered successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
