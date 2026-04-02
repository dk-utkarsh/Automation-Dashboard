import { getSql } from "./lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const sql = getSql();

    // Create tables
    await sql`
      CREATE TABLE IF NOT EXISTS departments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        icon VARCHAR(10) DEFAULT '📁',
        color VARCHAR(50) DEFAULT '#6366f1, #8b5cf6',
        description TEXT DEFAULT '',
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS tools (
        id SERIAL PRIMARY KEY,
        department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
        name VARCHAR(200) NOT NULL,
        description TEXT DEFAULT '',
        url TEXT NOT NULL,
        icon VARCHAR(10) DEFAULT '🔧',
        status VARCHAR(20) DEFAULT 'live',
        tags TEXT[] DEFAULT '{}',
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`CREATE INDEX IF NOT EXISTS idx_tools_department_id ON tools(department_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_departments_slug ON departments(slug)`;

    // Seed departments
    const departments = [
      { name: "Accounts", slug: "accounts", icon: "🏦", color: "#e94560, #c23152", description: "Finance & accounting automation tools", sort_order: 1 },
      { name: "Content", slug: "content", icon: "✍️", color: "#533483, #3b1f6e", description: "Content management and publishing tools", sort_order: 2 },
      { name: "Creation", slug: "creation", icon: "🎨", color: "#0f3460, #16213e", description: "Design and creative tools", sort_order: 3 },
      { name: "Waldent", slug: "waldent", icon: "🦷", color: "#1a936f, #114b5f", description: "Waldent operations tools", sort_order: 4 },
      { name: "Reports", slug: "reports", icon: "📊", color: "#f77f00, #d35400", description: "Reporting and analytics tools", sort_order: 5 },
    ];

    for (const dept of departments) {
      await sql`
        INSERT INTO departments (name, slug, icon, color, description, sort_order)
        VALUES (${dept.name}, ${dept.slug}, ${dept.icon}, ${dept.color}, ${dept.description}, ${dept.sort_order})
        ON CONFLICT (slug) DO NOTHING
      `;
    }

    // Get accounts department id
    const accountsDept = await sql`SELECT id FROM departments WHERE slug = 'accounts'`;
    const accountsId = accountsDept[0].id;

    // Seed tools for Accounts
    const tools = [
      { name: "Service Invoice", description: "Auto-generate service invoices", url: "https://service-invoices-bqi7w57fqssrdfuy7nqjax.streamlit.app/", icon: "📊", status: "live", tags: ["finance", "invoice"], sort_order: 1 },
      { name: "Vendor Mail System", description: "Send automated vendor communications", url: "https://dentalkart-vendor-mailer.vercel.app/", icon: "📧", status: "live", tags: ["vendor", "email"], sort_order: 2 },
      { name: "Vendor Bill Report", description: "Track and report vendor billing", url: "https://dk-accounts-vendor.vercel.app/", icon: "🧾", status: "live", tags: ["vendor", "billing"], sort_order: 3 },
    ];

    for (const tool of tools) {
      await sql`
        INSERT INTO tools (department_id, name, description, url, icon, status, tags, sort_order)
        VALUES (${accountsId}, ${tool.name}, ${tool.description}, ${tool.url}, ${tool.icon}, ${tool.status}, ${tool.tags}, ${tool.sort_order})
        ON CONFLICT DO NOTHING
      `;
    }

    return res.status(200).json({ message: "Database seeded successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
