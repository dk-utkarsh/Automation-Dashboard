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
