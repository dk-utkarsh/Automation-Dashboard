# Dentalkart Automation Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a centralized automation dashboard for Dentalkart where departments can access their tools, with an admin panel to manage departments and tools, all deployed on Vercel.

**Architecture:** React (Vite) frontend with Vercel serverless API functions, deployed as a single Vercel project. Frontend uses React Router for client-side routing. Backend serves API routes under `/api/`. Neon Postgres (via Vercel Marketplace) stores departments and tools using `@neondatabase/serverless` with `drizzle-orm`.

**Tech Stack:** React 18, Vite, React Router v6, Tailwind CSS v4, @neondatabase/serverless, drizzle-orm, Vercel serverless functions

---

## File Structure

```
automation-dashboard/
├── package.json                    # Root: scripts, dependencies
├── vercel.json                     # Vercel config: routes, builds
├── tailwind.config.js              # Tailwind: dark theme, custom colors
├── vite.config.js                  # Vite config
├── postcss.config.js               # PostCSS for Tailwind
├── index.html                      # Vite entry HTML
├── api/                            # Vercel serverless functions
│   ├── lib/
│   │   └── db.js                   # Database connection + query helper
│   ├── departments/
│   │   ├── index.js                # GET /api/departments (list all)
│   │   └── [slug].js               # GET /api/departments/:slug (with tools)
│   ├── tools/
│   │   └── [id].js                 # GET /api/tools/:id
│   ├── admin/
│   │   ├── departments/
│   │   │   ├── index.js            # POST /api/admin/departments
│   │   │   ├── [id].js             # PUT/DELETE /api/admin/departments/:id
│   │   │   └── reorder.js          # PUT /api/admin/departments/reorder
│   │   └── tools/
│   │       ├── index.js            # POST /api/admin/tools
│   │       ├── [id].js             # PUT/DELETE /api/admin/tools/:id
│   │       └── reorder.js          # PUT /api/admin/tools/reorder
│   └── seed.js                     # POST /api/seed — run seed data
├── src/
│   ├── main.jsx                    # React entry point
│   ├── index.css                   # Tailwind imports + global styles
│   ├── App.jsx                     # Router setup
│   ├── components/
│   │   ├── DepartmentCard.jsx      # Single department card (homepage)
│   │   ├── ToolCard.jsx            # Single tool card (department page)
│   │   ├── Navbar.jsx              # Top navigation bar
│   │   ├── StatusBadge.jsx         # Live/Beta/Down badge
│   │   └── IframeViewer.jsx        # Iframe wrapper with top bar
│   ├── pages/
│   │   ├── HomePage.jsx            # Department grid
│   │   ├── DepartmentPage.jsx      # Tools list for a department
│   │   ├── ToolPage.jsx            # Iframe tool viewer
│   │   └── admin/
│   │       ├── AdminLayout.jsx     # Admin shell with sidebar nav
│   │       ├── AdminDashboard.jsx  # Admin home — department list
│   │       ├── DepartmentForm.jsx  # Create/edit department form
│   │       ├── AdminToolsList.jsx  # Tools list for a department (admin)
│   │       └── ToolForm.jsx        # Create/edit tool form
│   └── lib/
│       └── api.js                  # Fetch wrapper for API calls
└── scripts/
    └── setup-db.sql                # SQL to create tables
```

---

### Task 1: Project Scaffolding & Configuration

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `vercel.json`
- Create: `src/main.jsx`
- Create: `src/index.css`
- Create: `.gitignore`

- [ ] **Step 1: Initialize project**

```bash
cd "/Users/maclapctp85/Desktop/Automation Dasboard"
npm init -y
```

- [ ] **Step 2: Install dependencies**

```bash
npm install react react-dom react-router-dom
npm install -D vite @vitejs/plugin-react tailwindcss @tailwindcss/vite postcss autoprefixer
npm install @neondatabase/serverless drizzle-orm
npm install -D drizzle-kit
```

- [ ] **Step 3: Create vite.config.js**

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
});
```

- [ ] **Step 4: Create postcss.config.js**

```js
export default {
  plugins: {},
};
```

- [ ] **Step 5: Create index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Dentalkart Automation Hub</title>
  </head>
  <body class="bg-[#0f0f1a] text-white min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Create src/index.css**

```css
@import "tailwindcss";
```

- [ ] **Step 7: Create src/main.jsx**

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

- [ ] **Step 8: Create src/App.jsx (placeholder)**

```jsx
export default function App() {
  return <div className="p-8 text-center text-2xl">Dentalkart Automation Hub</div>;
}
```

- [ ] **Step 9: Create vercel.json**

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ]
}
```

- [ ] **Step 10: Create .gitignore**

```
node_modules
dist
.env
.env.local
.vercel
.superpowers
```

- [ ] **Step 11: Add scripts to package.json**

Update the `scripts` field in `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "type": "module"
}
```

- [ ] **Step 12: Verify project runs**

```bash
npm run dev
```

Expected: Vite dev server starts, browser shows "Dentalkart Automation Hub" on dark background.

- [ ] **Step 13: Initialize git and commit**

```bash
git init
git add .
git commit -m "feat: scaffold project with Vite, React, Tailwind, Vercel config"
```

---

### Task 2: Database Schema & Connection

**Files:**
- Create: `scripts/setup-db.sql`
- Create: `api/lib/db.js`
- Create: `api/seed.js`

- [ ] **Step 1: Create SQL schema file**

Create `scripts/setup-db.sql`:

```sql
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
);

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
);

CREATE INDEX IF NOT EXISTS idx_tools_department_id ON tools(department_id);
CREATE INDEX IF NOT EXISTS idx_departments_slug ON departments(slug);
```

- [ ] **Step 2: Create database helper**

Create `api/lib/db.js` (lazy initialization — safe for build time):

```js
import { neon } from "@neondatabase/serverless";

let _sql = null;

export function getSql() {
  if (!_sql) {
    _sql = neon(process.env.DATABASE_URL);
  }
  return _sql;
}
```

- [ ] **Step 3: Create seed endpoint**

Create `api/seed.js`:

```js
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
```

- [ ] **Step 4: Commit**

```bash
git add scripts/setup-db.sql api/lib/db.js api/seed.js
git commit -m "feat: add database schema, connection helper, and seed endpoint"
```

---

### Task 3: Public API Endpoints

**Files:**
- Create: `api/departments/index.js`
- Create: `api/departments/[slug].js`
- Create: `api/tools/[id].js`

- [ ] **Step 1: Create GET /api/departments**

Create `api/departments/index.js`:

```js
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
```

- [ ] **Step 2: Create GET /api/departments/:slug**

Create `api/departments/[slug].js`:

```js
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
```

- [ ] **Step 3: Create GET /api/tools/:id**

Create `api/tools/[id].js`:

```js
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
```

- [ ] **Step 4: Commit**

```bash
git add api/departments/ api/tools/
git commit -m "feat: add public API endpoints for departments and tools"
```

---

### Task 4: Admin API Endpoints

**Files:**
- Create: `api/admin/departments/index.js`
- Create: `api/admin/departments/[id].js`
- Create: `api/admin/departments/reorder.js`
- Create: `api/admin/tools/index.js`
- Create: `api/admin/tools/[id].js`
- Create: `api/admin/tools/reorder.js`

- [ ] **Step 1: Create POST /api/admin/departments**

Create `api/admin/departments/index.js`:

```js
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
```

- [ ] **Step 2: Create PUT/DELETE /api/admin/departments/:id**

Create `api/admin/departments/[id].js`:

```js
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
```

- [ ] **Step 3: Create PUT /api/admin/departments/reorder**

Create `api/admin/departments/reorder.js`:

```js
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
      await sql`UPDATE departments SET sort_order = ${i + 1}, updated_at = NOW() WHERE id = ${orderedIds[i]}`;
    }

    return res.status(200).json({ message: "Reordered successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
```

- [ ] **Step 4: Create POST /api/admin/tools**

Create `api/admin/tools/index.js`:

```js
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
```

- [ ] **Step 5: Create PUT/DELETE /api/admin/tools/:id**

Create `api/admin/tools/[id].js`:

```js
import { getSql } from "../../lib/db.js";

export default async function handler(req, res) {
  const { id } = req.query;
  const sql = getSql();

  if (req.method === "PUT") {
    const { name, description, url, icon, status, tags } = req.body;

    if (!name || !url) {
      return res.status(400).json({ error: "Name and URL are required" });
    }

    const tagsArray = Array.isArray(tags) ? tags : [];

    try {
      const result = await sql`
        UPDATE tools
        SET name = ${name}, description = ${description || ""}, url = ${url}, icon = ${icon || "🔧"}, status = ${status || "live"}, tags = ${tagsArray}, updated_at = NOW()
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
```

- [ ] **Step 6: Create PUT /api/admin/tools/reorder**

Create `api/admin/tools/reorder.js`:

```js
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
```

- [ ] **Step 7: Commit**

```bash
git add api/admin/
git commit -m "feat: add admin API endpoints for CRUD and reorder"
```

---

### Task 5: API Client & Shared Components

**Files:**
- Create: `src/lib/api.js`
- Create: `src/components/Navbar.jsx`
- Create: `src/components/StatusBadge.jsx`

- [ ] **Step 1: Create API client**

Create `src/lib/api.js`:

```js
const BASE = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

export const api = {
  // Public
  getDepartments: () => request("/departments"),
  getDepartment: (slug) => request(`/departments/${slug}`),
  getTool: (id) => request(`/tools/${id}`),

  // Admin - Departments
  createDepartment: (data) => request("/admin/departments", { method: "POST", body: JSON.stringify(data) }),
  updateDepartment: (id, data) => request(`/admin/departments/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteDepartment: (id) => request(`/admin/departments/${id}`, { method: "DELETE" }),
  reorderDepartments: (orderedIds) => request("/admin/departments/reorder", { method: "PUT", body: JSON.stringify({ orderedIds }) }),

  // Admin - Tools
  createTool: (data) => request("/admin/tools", { method: "POST", body: JSON.stringify(data) }),
  updateTool: (id, data) => request(`/admin/tools/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteTool: (id) => request(`/admin/tools/${id}`, { method: "DELETE" }),
  reorderTools: (orderedIds) => request("/admin/tools/reorder", { method: "PUT", body: JSON.stringify({ orderedIds }) }),

  // Seed
  seed: () => request("/seed", { method: "POST" }),
};
```

- [ ] **Step 2: Create Navbar component**

Create `src/components/Navbar.jsx`:

```jsx
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <nav className="border-b border-white/10 bg-[#0f0f1a]/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            D
          </div>
          <span className="text-white font-bold text-lg">Dentalkart</span>
          <span className="text-indigo-400 text-sm hidden sm:inline">Automation Hub</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
              !isAdmin ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/admin"
            className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
              isAdmin ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 3: Create StatusBadge component**

Create `src/components/StatusBadge.jsx`:

```jsx
const statusConfig = {
  live: { label: "Live", color: "text-green-400", bg: "bg-green-400/10" },
  beta: { label: "Beta", color: "text-yellow-400", bg: "bg-yellow-400/10" },
  down: { label: "Down", color: "text-red-400", bg: "bg-red-400/10" },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.live;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${config.color} ${config.bg}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/api.js src/components/Navbar.jsx src/components/StatusBadge.jsx
git commit -m "feat: add API client and shared Navbar, StatusBadge components"
```

---

### Task 6: Homepage — Department Grid

**Files:**
- Create: `src/components/DepartmentCard.jsx`
- Create: `src/pages/HomePage.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create DepartmentCard component**

Create `src/components/DepartmentCard.jsx`:

```jsx
import { Link } from "react-router-dom";

export default function DepartmentCard({ department }) {
  const [fromColor, toColor] = department.color.split(", ");

  return (
    <Link
      to={`/department/${department.slug}`}
      className="group block rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/10 border border-white/5"
      style={{
        background: `linear-gradient(135deg, ${fromColor}22, ${toColor}22)`,
        borderColor: `${fromColor}33`,
      }}
    >
      <div className="text-4xl mb-3">{department.icon}</div>
      <h3 className="text-white font-semibold text-lg">{department.name}</h3>
      <p className="text-gray-400 text-sm mt-1">{department.tool_count || 0} tools</p>
      {department.description && (
        <p className="text-gray-500 text-xs mt-2 line-clamp-2">{department.description}</p>
      )}
    </Link>
  );
}
```

- [ ] **Step 2: Create HomePage**

Create `src/pages/HomePage.jsx`:

```jsx
import { useState, useEffect } from "react";
import { api } from "../lib/api";
import DepartmentCard from "../components/DepartmentCard";

export default function HomePage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getDepartments()
      .then(setDepartments)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400">Failed to load departments: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white">Automation Hub</h1>
        <p className="text-gray-400 mt-2">Select a department to access its tools</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {departments.map((dept) => (
          <DepartmentCard key={dept.id} department={dept} />
        ))}
      </div>

      {departments.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No departments yet. Add some from the admin panel.</p>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Update App.jsx with routes**

Replace `src/App.jsx`:

```jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/DepartmentCard.jsx src/pages/HomePage.jsx src/App.jsx
git commit -m "feat: add homepage with department grid"
```

---

### Task 7: Department Page — Tool Cards

**Files:**
- Create: `src/components/ToolCard.jsx`
- Create: `src/pages/DepartmentPage.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create ToolCard component**

Create `src/components/ToolCard.jsx`:

```jsx
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

export default function ToolCard({ tool, departmentSlug }) {
  const borderColors = {
    live: "border-l-green-500",
    beta: "border-l-yellow-500",
    down: "border-l-red-500",
  };

  return (
    <Link
      to={`/department/${departmentSlug}/tool/${tool.id}`}
      className={`block bg-white/5 border border-white/10 border-l-4 ${borderColors[tool.status] || borderColors.live} rounded-xl p-5 transition-all duration-200 hover:bg-white/10 hover:shadow-lg`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{tool.icon}</span>
        <StatusBadge status={tool.status} />
      </div>

      <h3 className="text-white font-semibold">{tool.name}</h3>

      {tool.description && (
        <p className="text-gray-400 text-sm mt-1 line-clamp-2">{tool.description}</p>
      )}

      {tool.tags && tool.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {tool.tags.map((tag) => (
            <span
              key={tag}
              className="bg-white/5 text-gray-400 text-xs px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
```

- [ ] **Step 2: Create DepartmentPage**

Create `src/pages/DepartmentPage.jsx`:

```jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";
import ToolCard from "../components/ToolCard";

export default function DepartmentPage() {
  const { slug } = useParams();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.getDepartment(slug)
      .then(setDepartment)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400">{error}</p>
        <Link to="/" className="text-indigo-400 mt-4 inline-block hover:underline">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <Link to="/" className="text-gray-400 hover:text-white text-sm flex items-center gap-2 mb-6">
        <span>←</span> Back to Dashboard
      </Link>

      <div className="flex items-center gap-4 mb-8">
        <span className="text-4xl">{department.icon}</span>
        <div>
          <h1 className="text-2xl font-bold text-white">{department.name}</h1>
          {department.description && (
            <p className="text-gray-400 text-sm mt-1">{department.description}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {department.tools?.map((tool) => (
          <ToolCard key={tool.id} tool={tool} departmentSlug={slug} />
        ))}
      </div>

      {(!department.tools || department.tools.length === 0) && (
        <p className="text-gray-500 text-center py-12">No tools in this department yet.</p>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Add route to App.jsx**

Update `src/App.jsx`:

```jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import DepartmentPage from "./pages/DepartmentPage";

export default function App() {
  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/department/:slug" element={<DepartmentPage />} />
      </Routes>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/ToolCard.jsx src/pages/DepartmentPage.jsx src/App.jsx
git commit -m "feat: add department page with rich tool cards"
```

---

### Task 8: Tool Iframe Viewer

**Files:**
- Create: `src/components/IframeViewer.jsx`
- Create: `src/pages/ToolPage.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create IframeViewer component**

Create `src/components/IframeViewer.jsx`:

```jsx
export default function IframeViewer({ url, title }) {
  return (
    <iframe
      src={url}
      title={title}
      className="w-full border-0"
      style={{ height: "calc(100vh - 120px)" }}
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
    />
  );
}
```

- [ ] **Step 2: Create ToolPage**

Create `src/pages/ToolPage.jsx`:

```jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";
import StatusBadge from "../components/StatusBadge";
import IframeViewer from "../components/IframeViewer";

export default function ToolPage() {
  const { slug, toolId } = useParams();
  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getTool(toolId)
      .then(setTool)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [toolId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400">{error}</p>
        <Link to={`/department/${slug}`} className="text-indigo-400 mt-4 inline-block hover:underline">
          Back to Department
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-[#1a1a2e] border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to={`/department/${slug}`}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Back
          </Link>
          <div className="h-5 w-px bg-white/10" />
          <span className="text-lg">{tool.icon}</span>
          <div>
            <h2 className="text-white font-semibold text-sm">{tool.name}</h2>
            <span className="text-gray-500 text-xs">{tool.department_name}</span>
          </div>
          <StatusBadge status={tool.status} />
        </div>

        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1"
        >
          Open in new tab ↗
        </a>
      </div>

      <IframeViewer url={tool.url} title={tool.name} />
    </div>
  );
}
```

- [ ] **Step 3: Add route to App.jsx**

Update `src/App.jsx`:

```jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import DepartmentPage from "./pages/DepartmentPage";
import ToolPage from "./pages/ToolPage";

export default function App() {
  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <Routes>
        <Route path="/department/:slug/tool/:toolId" element={<ToolPage />} />
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/department/:slug" element={<DepartmentPage />} />
                <Route path="/admin/*" element={<AdminRoutes />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </div>
  );
}

// Placeholder — implemented in Task 9
function AdminRoutes() {
  return null;
}
```

Note: The ToolPage is outside the Navbar layout because the iframe needs full viewport height. The Navbar is shown on all other pages.

- [ ] **Step 4: Commit**

```bash
git add src/components/IframeViewer.jsx src/pages/ToolPage.jsx src/App.jsx
git commit -m "feat: add tool iframe viewer page"
```

---

### Task 9: Admin Panel — Department Management

**Files:**
- Create: `src/pages/admin/AdminLayout.jsx`
- Create: `src/pages/admin/AdminDashboard.jsx`
- Create: `src/pages/admin/DepartmentForm.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create AdminLayout**

Create `src/pages/admin/AdminLayout.jsx`:

```jsx
import { Outlet, Link, useLocation } from "react-router-dom";

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-1">Manage departments and tools</p>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
```

- [ ] **Step 2: Create AdminDashboard**

Create `src/pages/admin/AdminDashboard.jsx`:

```jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";

export default function AdminDashboard() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDepartments()
      .then(setDepartments)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}" and all its tools?`)) return;

    try {
      await api.deleteDepartment(id);
      setDepartments((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  };

  const handleSeed = async () => {
    if (!confirm("This will seed the database with default departments and tools. Continue?")) return;

    try {
      await api.seed();
      const data = await api.getDepartments();
      setDepartments(data);
      alert("Database seeded successfully!");
    } catch (err) {
      alert("Seed failed: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/admin/departments/new"
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Add Department
        </Link>
        {departments.length === 0 && (
          <button
            onClick={handleSeed}
            className="bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Seed Default Data
          </button>
        )}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-gray-400 text-xs font-medium uppercase px-6 py-3">Department</th>
              <th className="text-left text-gray-400 text-xs font-medium uppercase px-6 py-3">Tools</th>
              <th className="text-right text-gray-400 text-xs font-medium uppercase px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{dept.icon}</span>
                    <div>
                      <div className="text-white font-medium">{dept.name}</div>
                      <div className="text-gray-500 text-xs">{dept.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-400 text-sm">
                  {dept.tool_count || 0} tools
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/admin/departments/${dept.id}/tools`}
                      className="text-indigo-400 hover:text-indigo-300 text-sm"
                    >
                      Manage Tools
                    </Link>
                    <Link
                      to={`/admin/departments/${dept.id}/edit`}
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(dept.id, dept.name)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {departments.length === 0 && (
          <p className="text-gray-500 text-center py-8">No departments yet. Add one or seed default data.</p>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create DepartmentForm**

Create `src/pages/admin/DepartmentForm.jsx`:

```jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../../lib/api";

export default function DepartmentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    icon: "📁",
    color: "#6366f1, #8b5cf6",
    description: "",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;

    api.getDepartments()
      .then((departments) => {
        const dept = departments.find((d) => d.id === Number(id));
        if (dept) {
          setForm({ name: dept.name, icon: dept.icon, color: dept.color, description: dept.description || "" });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (isEdit) {
        await api.updateDepartment(id, form);
      } else {
        await api.createDepartment(form);
      }
      navigate("/admin");
    } catch (err) {
      alert("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <Link to="/admin" className="text-gray-400 hover:text-white text-sm mb-6 inline-block">← Back</Link>

      <h2 className="text-xl font-bold text-white mb-6">
        {isEdit ? "Edit Department" : "New Department"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-400 text-sm mb-1">Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            placeholder="e.g. Accounts"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-1">Icon (emoji)</label>
          <input
            type="text"
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            placeholder="e.g. 🏦"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-1">Gradient Colors</label>
          <input
            type="text"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            placeholder="e.g. #6366f1, #8b5cf6"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
            placeholder="Short description of this department"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            {saving ? "Saving..." : isEdit ? "Update" : "Create"}
          </button>
          <Link
            to="/admin"
            className="bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
```

- [ ] **Step 4: Update App.jsx with admin routes**

Replace `src/App.jsx`:

```jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import DepartmentPage from "./pages/DepartmentPage";
import ToolPage from "./pages/ToolPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DepartmentForm from "./pages/admin/DepartmentForm";

export default function App() {
  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <Routes>
        <Route path="/department/:slug/tool/:toolId" element={<ToolPage />} />
        <Route
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/department/:slug" element={<DepartmentPage />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="departments/new" element={<DepartmentForm />} />
                  <Route path="departments/:id/edit" element={<DepartmentForm />} />
                </Route>
              </Routes>
            </>
          }
        />
      </Routes>
    </div>
  );
}
```

Wait — nested `<Routes>` inside a route element won't work. Let me fix the router structure:

```jsx
import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import DepartmentPage from "./pages/DepartmentPage";
import ToolPage from "./pages/ToolPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DepartmentForm from "./pages/admin/DepartmentForm";

function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <Routes>
        {/* Tool page — full viewport, no navbar */}
        <Route path="/department/:slug/tool/:toolId" element={<ToolPage />} />

        {/* All other pages — with navbar */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/department/:slug" element={<DepartmentPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="departments/new" element={<DepartmentForm />} />
            <Route path="departments/:id/edit" element={<DepartmentForm />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/admin/AdminLayout.jsx src/pages/admin/AdminDashboard.jsx src/pages/admin/DepartmentForm.jsx src/App.jsx
git commit -m "feat: add admin panel with department CRUD"
```

---

### Task 10: Admin Panel — Tool Management

**Files:**
- Create: `src/pages/admin/AdminToolsList.jsx`
- Create: `src/pages/admin/ToolForm.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create AdminToolsList**

Create `src/pages/admin/AdminToolsList.jsx`:

```jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../../lib/api";
import StatusBadge from "../../components/StatusBadge";

export default function AdminToolsList() {
  const { id } = useParams();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDepartment = async () => {
    try {
      const departments = await api.getDepartments();
      const dept = departments.find((d) => d.id === Number(id));
      if (!dept) throw new Error("Department not found");

      const fullDept = await api.getDepartment(dept.slug);
      setDepartment(fullDept);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDepartment(); }, [id]);

  const handleDelete = async (toolId, toolName) => {
    if (!confirm(`Delete "${toolName}"?`)) return;

    try {
      await api.deleteTool(toolId);
      loadDepartment();
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!department) {
    return <p className="text-red-400">Department not found</p>;
  }

  return (
    <div>
      <Link to="/admin" className="text-gray-400 hover:text-white text-sm mb-6 inline-block">← Back</Link>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{department.icon}</span>
          <h2 className="text-xl font-bold text-white">{department.name} — Tools</h2>
        </div>
        <Link
          to={`/admin/departments/${id}/tools/new`}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Add Tool
        </Link>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-gray-400 text-xs font-medium uppercase px-6 py-3">Tool</th>
              <th className="text-left text-gray-400 text-xs font-medium uppercase px-6 py-3">Status</th>
              <th className="text-left text-gray-400 text-xs font-medium uppercase px-6 py-3">URL</th>
              <th className="text-right text-gray-400 text-xs font-medium uppercase px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {department.tools?.map((tool) => (
              <tr key={tool.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{tool.icon}</span>
                    <div>
                      <div className="text-white font-medium">{tool.name}</div>
                      <div className="text-gray-500 text-xs">{tool.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={tool.status} />
                </td>
                <td className="px-6 py-4">
                  <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 text-sm truncate block max-w-xs">
                    {tool.url}
                  </a>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/admin/departments/${id}/tools/${tool.id}/edit`}
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(tool.id, tool.name)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!department.tools || department.tools.length === 0) && (
          <p className="text-gray-500 text-center py-8">No tools yet. Add one above.</p>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create ToolForm**

Create `src/pages/admin/ToolForm.jsx`:

```jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../../lib/api";

export default function ToolForm() {
  const { id: departmentId, toolId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(toolId);

  const [form, setForm] = useState({
    name: "",
    description: "",
    url: "",
    icon: "🔧",
    status: "live",
    tags: "",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;

    api.getTool(toolId)
      .then((tool) => {
        setForm({
          name: tool.name,
          description: tool.description || "",
          url: tool.url,
          icon: tool.icon,
          status: tool.status,
          tags: (tool.tags || []).join(", "),
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [toolId, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const data = {
      ...form,
      department_id: Number(departmentId),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    try {
      if (isEdit) {
        await api.updateTool(toolId, data);
      } else {
        await api.createTool(data);
      }
      navigate(`/admin/departments/${departmentId}/tools`);
    } catch (err) {
      alert("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <Link to={`/admin/departments/${departmentId}/tools`} className="text-gray-400 hover:text-white text-sm mb-6 inline-block">
        ← Back to Tools
      </Link>

      <h2 className="text-xl font-bold text-white mb-6">
        {isEdit ? "Edit Tool" : "New Tool"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-400 text-sm mb-1">Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            placeholder="e.g. Invoice Generator"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-1">URL *</label>
          <input
            type="url"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            required
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            placeholder="https://your-app.vercel.app/"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
            placeholder="What does this tool do?"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Icon (emoji)</label>
            <input
              type="text"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="live">Live</option>
              <option value="beta">Beta</option>
              <option value="down">Down</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-1">Tags (comma-separated)</label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            placeholder="e.g. finance, daily, automation"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            {saving ? "Saving..." : isEdit ? "Update" : "Create"}
          </button>
          <Link
            to={`/admin/departments/${departmentId}/tools`}
            className="bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
```

- [ ] **Step 3: Update App.jsx with tool admin routes**

Replace `src/App.jsx`:

```jsx
import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import DepartmentPage from "./pages/DepartmentPage";
import ToolPage from "./pages/ToolPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DepartmentForm from "./pages/admin/DepartmentForm";
import AdminToolsList from "./pages/admin/AdminToolsList";
import ToolForm from "./pages/admin/ToolForm";

function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <Routes>
        <Route path="/department/:slug/tool/:toolId" element={<ToolPage />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/department/:slug" element={<DepartmentPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="departments/new" element={<DepartmentForm />} />
            <Route path="departments/:id/edit" element={<DepartmentForm />} />
            <Route path="departments/:id/tools" element={<AdminToolsList />} />
            <Route path="departments/:id/tools/new" element={<ToolForm />} />
            <Route path="departments/:id/tools/:toolId/edit" element={<ToolForm />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/admin/AdminToolsList.jsx src/pages/admin/ToolForm.jsx src/App.jsx
git commit -m "feat: add admin tool management with CRUD"
```

---

### Task 11: Final Polish & Deploy Configuration

**Files:**
- Modify: `vercel.json`
- Modify: `package.json`

- [ ] **Step 1: Update vercel.json for API and SPA routing**

Replace `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ]
}
```

- [ ] **Step 2: Verify package.json has correct scripts and type**

Ensure `package.json` has:

```json
{
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

- [ ] **Step 3: Run build to verify**

```bash
npm run build
```

Expected: Vite builds successfully, output in `dist/`.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: finalize Vercel config and build setup"
```

- [ ] **Step 5: Deploy to Vercel**

```bash
vercel --prod
```

After deploy, run the seed endpoint:
```bash
curl -X POST https://your-app.vercel.app/api/seed
```
