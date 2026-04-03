import "dotenv/config";
import express from "express";
import cors from "cors";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { neon } from "@neondatabase/serverless";

const app = express();
app.use(cors());
app.use(express.json());

const sql = neon(process.env.DATABASE_URL);

// In-memory session store (simple token-based auth)
const sessions = new Map();

// ---- AUTH ----
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Username and password are required" });

    const users = await sql`SELECT * FROM admin_users WHERE username = ${username}`;
    if (users.length === 0) return res.status(401).json({ error: "Invalid credentials" });

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = crypto.randomBytes(32).toString("hex");
    sessions.set(token, { userId: user.id, username: user.username });

    res.json({ token, username: user.username });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post("/api/auth/logout", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (token) sessions.delete(token);
  res.json({ message: "Logged out" });
});

app.get("/api/auth/me", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const session = token && sessions.get(token);
  if (!session) return res.status(401).json({ error: "Not authenticated" });
  res.json({ username: session.username });
});

// Auth middleware for admin routes
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const session = token && sessions.get(token);
  if (!session) return res.status(401).json({ error: "Not authenticated" });
  req.user = session;
  next();
}

// ---- SEED ----
app.post("/api/seed", async (req, res) => {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS departments (
        id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, slug VARCHAR(100) UNIQUE NOT NULL,
        icon VARCHAR(10) DEFAULT '📁', color VARCHAR(50) DEFAULT '#6366f1, #8b5cf6',
        description TEXT DEFAULT '', sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW()
      )`;
    await sql`
      CREATE TABLE IF NOT EXISTS tools (
        id SERIAL PRIMARY KEY, department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
        name VARCHAR(200) NOT NULL, description TEXT DEFAULT '', url TEXT NOT NULL,
        icon VARCHAR(10) DEFAULT '🔧', status VARCHAR(20) DEFAULT 'live',
        tags TEXT[] DEFAULT '{}', sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW()
      )`;
    await sql`CREATE INDEX IF NOT EXISTS idx_tools_department_id ON tools(department_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_departments_slug ON departments(slug)`;

    // Admin users table
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY, username VARCHAR(100) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )`;

    // Create default admin user (password: admin123)
    const existing = await sql`SELECT id FROM admin_users WHERE username = 'admin'`;
    if (existing.length === 0) {
      const hash = await bcrypt.hash("admin123", 10);
      await sql`INSERT INTO admin_users (username, password_hash) VALUES ('admin', ${hash})`;
    }

    const depts = [
      { name: "Accounts", slug: "accounts", icon: "🏦", color: "#e94560, #c23152", description: "Finance & accounting automation tools", sort_order: 1 },
      { name: "Content", slug: "content", icon: "✍️", color: "#533483, #3b1f6e", description: "Content management and publishing tools", sort_order: 2 },
      { name: "Creation", slug: "creation", icon: "🎨", color: "#0f3460, #16213e", description: "Design and creative tools", sort_order: 3 },
      { name: "Waldent", slug: "waldent", icon: "🦷", color: "#1a936f, #114b5f", description: "Waldent operations tools", sort_order: 4 },
      { name: "Reports", slug: "reports", icon: "📊", color: "#f77f00, #d35400", description: "Reporting and analytics tools", sort_order: 5 },
    ];
    for (const d of depts) {
      await sql`INSERT INTO departments (name, slug, icon, color, description, sort_order) VALUES (${d.name}, ${d.slug}, ${d.icon}, ${d.color}, ${d.description}, ${d.sort_order}) ON CONFLICT (slug) DO NOTHING`;
    }

    const acct = await sql`SELECT id FROM departments WHERE slug = 'accounts'`;
    const accountsId = acct[0].id;
    const tools = [
      { name: "Service Invoice", description: "Auto-generate service invoices", url: "https://service-invoices-bqi7w57fqssrdfuy7nqjax.streamlit.app/", icon: "📊", status: "live", tags: ["finance", "invoice"], sort_order: 1 },
      { name: "Vendor Mail System", description: "Send automated vendor communications", url: "https://dentalkart-vendor-mailer.vercel.app/", icon: "📧", status: "live", tags: ["vendor", "email"], sort_order: 2 },
      { name: "Vendor Bill Report", description: "Track and report vendor billing", url: "https://dk-accounts-vendor.vercel.app/", icon: "🧾", status: "live", tags: ["vendor", "billing"], sort_order: 3 },
    ];
    for (const t of tools) {
      await sql`INSERT INTO tools (department_id, name, description, url, icon, status, tags, sort_order) VALUES (${accountsId}, ${t.name}, ${t.description}, ${t.url}, ${t.icon}, ${t.status}, ${t.tags}, ${t.sort_order}) ON CONFLICT DO NOTHING`;
    }
    res.json({ message: "Database seeded successfully" });
  } catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
});

// ---- PUBLIC ----
app.get("/api/departments", async (req, res) => {
  try {
    const result = await sql`
      SELECT d.*, COUNT(t.id)::int AS tool_count FROM departments d
      LEFT JOIN tools t ON t.department_id = d.id GROUP BY d.id ORDER BY d.sort_order ASC, d.name ASC`;
    // Add has_password flag but never expose actual password
    res.json(result.map(d => ({ ...d, has_password: Boolean(d.password && d.password.length > 0), password: undefined })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Department password verification
app.post("/api/departments/:slug/verify", async (req, res) => {
  try {
    const { password } = req.body;
    const dept = await sql`SELECT id, password FROM departments WHERE slug = ${req.params.slug}`;
    if (dept.length === 0) return res.status(404).json({ error: "Department not found" });

    if (!dept[0].password || dept[0].password.length === 0) {
      return res.json({ verified: true });
    }

    if (password === dept[0].password) {
      return res.json({ verified: true });
    }

    return res.status(401).json({ error: "Incorrect password" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get("/api/departments/:slug", async (req, res) => {
  try {
    const dept = await sql`SELECT * FROM departments WHERE slug = ${req.params.slug}`;
    if (dept.length === 0) return res.status(404).json({ error: "Department not found" });

    // If department has password, check authorization
    if (dept[0].password && dept[0].password.length > 0) {
      const authPass = req.headers["x-department-password"];
      if (authPass !== dept[0].password) {
        return res.status(401).json({ error: "Password required", has_password: true });
      }
    }

    const tools = await sql`SELECT * FROM tools WHERE department_id = ${dept[0].id} ORDER BY sort_order ASC, name ASC`;
    res.json({ ...dept[0], tools, password: undefined });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get("/api/tools/:id", async (req, res) => {
  try {
    const result = await sql`
      SELECT t.*, d.name AS department_name, d.slug AS department_slug
      FROM tools t JOIN departments d ON d.id = t.department_id WHERE t.id = ${req.params.id}`;
    if (result.length === 0) return res.status(404).json({ error: "Tool not found" });
    res.json(result[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ---- ADMIN: Departments ----
app.post("/api/admin/departments", requireAuth, async (req, res) => {
  try {
    const { name, icon, color, description, password } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const maxO = await sql`SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order FROM departments`;
    const result = await sql`
      INSERT INTO departments (name, slug, icon, color, description, sort_order, password)
      VALUES (${name}, ${slug}, ${icon || "📁"}, ${color || "#6366f1, #8b5cf6"}, ${description || ""}, ${maxO[0].next_order}, ${password || ""}) RETURNING *`;
    res.status(201).json({ ...result[0], password: undefined });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put("/api/admin/departments/:id", requireAuth, async (req, res) => {
  try {
    const { name, icon, color, description, password } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const result = await sql`
      UPDATE departments SET name=${name}, slug=${slug}, icon=${icon||"📁"}, color=${color||"#6366f1, #8b5cf6"}, description=${description||""}, password=${password !== undefined ? password : ""}, updated_at=NOW()
      WHERE id=${req.params.id} RETURNING *`;
    if (result.length === 0) return res.status(404).json({ error: "Department not found" });
    res.json({ ...result[0], password: undefined });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete("/api/admin/departments/:id", requireAuth, async (req, res) => {
  try {
    const result = await sql`DELETE FROM departments WHERE id=${req.params.id} RETURNING *`;
    if (result.length === 0) return res.status(404).json({ error: "Department not found" });
    res.json({ message: "Department deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put("/api/admin/departments/reorder", requireAuth, async (req, res) => {
  try {
    const { orderedIds } = req.body;
    for (let i = 0; i < orderedIds.length; i++) {
      await sql`UPDATE departments SET sort_order=${i+1}, updated_at=NOW() WHERE id=${orderedIds[i]}`;
    }
    res.json({ message: "Reordered" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ---- ADMIN: Tools ----
app.post("/api/admin/tools", requireAuth, async (req, res) => {
  try {
    const { department_id, name, description, url, icon, status, tags, managed_by } = req.body;
    if (!name || !url || !department_id) return res.status(400).json({ error: "department_id, name, and url are required" });
    const maxO = await sql`SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order FROM tools WHERE department_id=${department_id}`;
    const tagsArray = Array.isArray(tags) ? tags : [];
    const result = await sql`
      INSERT INTO tools (department_id, name, description, url, icon, status, tags, sort_order, managed_by)
      VALUES (${department_id}, ${name}, ${description||""}, ${url}, ${icon||"🔧"}, ${status||"live"}, ${tagsArray}, ${maxO[0].next_order}, ${managed_by||""}) RETURNING *`;
    res.status(201).json(result[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put("/api/admin/tools/:id", requireAuth, async (req, res) => {
  try {
    const { name, description, url, icon, status, tags, managed_by } = req.body;
    if (!name || !url) return res.status(400).json({ error: "Name and URL are required" });
    const tagsArray = Array.isArray(tags) ? tags : [];
    const result = await sql`
      UPDATE tools SET name=${name}, description=${description||""}, url=${url}, icon=${icon||"🔧"}, status=${status||"live"}, tags=${tagsArray}, managed_by=${managed_by||""}, updated_at=NOW()
      WHERE id=${req.params.id} RETURNING *`;
    if (result.length === 0) return res.status(404).json({ error: "Tool not found" });
    res.json(result[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete("/api/admin/tools/:id", requireAuth, async (req, res) => {
  try {
    const result = await sql`DELETE FROM tools WHERE id=${req.params.id} RETURNING *`;
    if (result.length === 0) return res.status(404).json({ error: "Tool not found" });
    res.json({ message: "Tool deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put("/api/admin/tools/reorder", requireAuth, async (req, res) => {
  try {
    const { orderedIds } = req.body;
    for (let i = 0; i < orderedIds.length; i++) {
      await sql`UPDATE tools SET sort_order=${i+1}, updated_at=NOW() WHERE id=${orderedIds[i]}`;
    }
    res.json({ message: "Reordered" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));
