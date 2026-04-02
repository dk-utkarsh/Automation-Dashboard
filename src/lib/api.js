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
