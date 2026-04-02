# Dentalkart Automation Dashboard — Design Spec

## Overview

A centralized dashboard for Dentalkart.com where teams across departments (Accounts, Content, Creation, Waldent, Reports, etc.) can access their automation tools deployed on Vercel and Streamlit. Admin can manage departments and tools via an admin panel. Tools load embedded in an iframe within the dashboard.

## Tech Stack

- **Frontend**: React (Vite) + React Router
- **Backend**: Vercel Serverless Functions
- **Database**: Neon Postgres (via Vercel Marketplace) + @neondatabase/serverless
- **Deployment**: Vercel
- **Styling**: Tailwind CSS

## Layout Decisions

- **Homepage**: Grid of department cards — each card shows icon, name, tool count, gradient color
- **Department page**: Rich tool cards with status badges (Live/Beta/Down), tags, descriptions, color-coded left border
- **Tool view**: Iframe embedded within the dashboard (top bar with tool name + back button)
- **Theme**: Dark professional — dark background (#0f0f1a / #1a1a2e), purple/indigo accents (#6366f1 / #8b5cf6), glassmorphism-style cards

## Pages & Routes

| Route | Description |
|---|---|
| `/` | Department grid landing page |
| `/department/:slug` | Department's tools displayed as rich cards |
| `/department/:slug/tool/:toolId` | Tool loaded in iframe with top navigation bar |
| `/admin` | Admin panel — manage departments and tools |
| `/admin/departments` | CRUD for departments |
| `/admin/departments/:id/tools` | CRUD for tools within a department |

## Data Model

### departments

| Column | Type | Notes |
|---|---|---|
| id | SERIAL PRIMARY KEY | Auto-increment |
| name | VARCHAR(100) | e.g. "Accounts" |
| slug | VARCHAR(100) UNIQUE | e.g. "accounts" |
| icon | VARCHAR(10) | Emoji, e.g. "🏦" |
| color | VARCHAR(50) | Gradient CSS, e.g. "#6366f1, #8b5cf6" |
| description | TEXT | Short description |
| sort_order | INTEGER | Display order |
| created_at | TIMESTAMP | Default now() |
| updated_at | TIMESTAMP | Default now() |

### tools

| Column | Type | Notes |
|---|---|---|
| id | SERIAL PRIMARY KEY | Auto-increment |
| department_id | INTEGER FK | References departments.id |
| name | VARCHAR(200) | e.g. "Service Invoice" |
| description | TEXT | Short description of what it does |
| url | TEXT | Full URL to the deployed tool |
| icon | VARCHAR(10) | Emoji |
| status | VARCHAR(20) | "live", "beta", or "down" |
| tags | TEXT[] | PostgreSQL array, e.g. {"finance", "daily"} |
| sort_order | INTEGER | Display order within department |
| created_at | TIMESTAMP | Default now() |
| updated_at | TIMESTAMP | Default now() |

## Admin Panel

Accessible at `/admin` with no authentication (for now).

### Capabilities
- **Departments**: Create, edit, delete, reorder. Fields: name, icon (emoji picker or text input), color (gradient), description.
- **Tools**: Create, edit, delete, reorder within a department. Fields: name, description, URL, icon, status (dropdown: Live/Beta/Down), tags (comma-separated input).

### Admin UI
- Simple table/list view of departments with edit/delete buttons
- Click into a department to manage its tools
- Forms for create/edit with validation (name required, URL required for tools)

## Iframe Embedding

When a user clicks a tool card, the app navigates to `/department/:slug/tool/:toolId`. This page renders:
- A top bar with: back arrow, tool name, department name, status badge, and an "Open in new tab" fallback link
- An iframe filling the remaining viewport height, loading the tool's URL

Note: Some external apps may block iframe embedding via X-Frame-Options headers. The "Open in new tab" fallback handles this case.

## API Endpoints

### Public
- `GET /api/departments` — List all departments with tool counts
- `GET /api/departments/:slug` — Get department with its tools
- `GET /api/tools/:id` — Get single tool details

### Admin
- `POST /api/admin/departments` — Create department
- `PUT /api/admin/departments/:id` — Update department
- `DELETE /api/admin/departments/:id` — Delete department (cascades tools)
- `POST /api/admin/tools` — Create tool
- `PUT /api/admin/tools/:id` — Update tool
- `DELETE /api/admin/tools/:id` — Delete tool
- `PUT /api/admin/departments/reorder` — Reorder departments
- `PUT /api/admin/tools/reorder` — Reorder tools

## Seed Data

### Department: Accounts
- icon: 🏦
- color: "#e94560, #c23152"

### Tools under Accounts:
1. **Service Invoice** — icon: 📊, url: `https://service-invoices-bqi7w57fqssrdfuy7nqjax.streamlit.app/`, status: live, tags: [finance, invoice]
2. **Vendor Mail System** — icon: 📧, url: `https://dentalkart-vendor-mailer.vercel.app/`, status: live, tags: [vendor, email]
3. **Vendor Bill Report** — icon: 🧾, url: `https://dk-accounts-vendor.vercel.app/`, status: live, tags: [vendor, billing]

### Empty Departments (to be populated via admin):
- Content (icon: ✍️, color: "#533483, #3b1f6e")
- Creation (icon: 🎨, color: "#0f3460, #16213e")
- Waldent (icon: 🦷, color: "#1a936f, #114b5f")
- Reports (icon: 📊, color: "#f77f00, #d35400")

## Out of Scope

- User authentication / department-specific login
- Search/filter functionality
- Usage analytics / tracking
- Notifications
