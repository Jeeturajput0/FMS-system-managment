import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URI = "http://localhost:5000";

const ModuleAdd = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    order: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // Input Change
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // Submit Module
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Validation
    if (!courseId) {
      setError("Course ID not found");
      return;
    }

    if (!formData.title.trim()) {
      setError("Module title is required");
      return;
    }

    try {
      setLoading(true);

      // =========================
      // Get Token
      // =========================
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("authToken");

      console.log("Course ID:", courseId);
      console.log("Token:", token);

      if (!token) {
        setError("You are not logged in. Please login again.");
        return;
      }

      // =========================
      // API Request
      // =========================
      const response = await fetch(`${API_URI}/api/modules`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          course: courseId,
          title: formData.title.trim(),
          description: formData.description.trim(),
          order: Number(formData.order),
        }),
      });

      // =========================
      // Response
      // =========================
      const data = await response.json();

      console.log("Module API Response:", data);

      // =========================
      // Unauthorized
      // =========================
      if (response.status === 401) {
        setError(
          "Unauthorized. Your login session is invalid or expired. Please login again."
        );
        return;
      }

      // =========================
      // Other Errors
      // =========================
      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Failed to create module"
        );
      }

      // =========================
      // Success
      // =========================
      alert("Module added successfully!");

      navigate(`/admin/courses/${courseId}/modules`);

    } catch (error) {
      console.error("Create Module Error:", error);

      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="max-w-3xl mx-auto">

        {/* =========================
            Header
        ========================== */}
        <div className="mb-6">

          <button
            type="button"
            onClick={() =>
              navigate(`/admin/courses/${courseId}/modules`)
            }
            className="mb-4 text-sm text-gray-600 hover:text-orange-500"
          >
            ← Back to Modules
          </button>

          <h1 className="text-2xl font-bold text-gray-900">
            Add New Module
          </h1>

          <p className="text-gray-500 mt-1">
            Create a new module for this course.
          </p>

        </div>

        {/* =========================
            Error Message
        ========================== */}
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* =========================
            Form
        ========================== */}
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >

          {/* Module Title */}
          <div className="mb-5">

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Module Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter module title"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />

          </div>

          {/* Description */}
          <div className="mb-5">

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter module description"
              rows={5}
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />

          </div>

          {/* Order */}
          <div className="mb-6">

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Module Order
            </label>

            <input
              type="number"
              name="order"
              min="1"
              value={formData.order}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />

            <p className="mt-1 text-xs text-gray-500">
              Example: 1, 2, 3...
            </p>

          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                navigate(`/admin/courses/${courseId}/modules`)
              }
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-orange-500 px-5 py-2.5 font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Saving..." : "Add Module"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default ModuleAdd;