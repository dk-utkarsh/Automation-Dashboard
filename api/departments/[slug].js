import { getSql } from "../lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { slug } = req.query;

  try {
    const sql = getSql();
    const deptResult = await sql`
      SELECT * FROM departments WHERE slug = ${slug}
    `;

    if (deptResult.length === 0) {
      return res.status(404).json({ error: "Department not found" });
    }

    const department = deptResult[0];

    const toolsResult = await sql`
      SELECT * FROM tools
      WHERE department_id = ${department.id}
      ORDER BY sort_order ASC, name ASC
    `;

    return res.status(200).json({
      ...department,
      tools: toolsResult,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
