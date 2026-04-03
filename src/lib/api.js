const BASE = "/api";

function getToken() {
  return localStorage.getItem("admin_token");
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    if (res.status === 401 && path !== "/auth/login") {
      localStorage.removeItem("admin_token");
      window.dispatchEvent(new Event("auth-expired"));
    }
    throw new Error(data.error || "Request failed");
  }

  return data;
}

export const api = {
  // Auth
  login: (username, password) => request("/auth/login", { method: "POST", body: JSON.stringify({ username, password }) }),
  logout: () => request("/auth/logout", { method: "POST" }),
  getMe: () => request("/auth/me"),

  // Public
  getDepartments: () => request("/departments"),
  getDepartment: (slug, deptPassword) => request(`/departments/${slug}`, deptPassword ? { headers: { "X-Department-Password": deptPassword } } : {}),
  verifyDepartment: (slug, password) => request(`/departments/${slug}/verify`, { method: "POST", body: JSON.stringify({ password }) }),
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

export function isLoggedIn() {
  return Boolean(getToken());
}

export function saveToken(token) {
  localStorage.setItem("admin_token", token);
}

export function clearToken() {
  localStorage.removeItem("admin_token");
}
