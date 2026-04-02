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
