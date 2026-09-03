import React, { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, Save } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiFetch, apiUpload } from "../../../utils/api";

export const CourseAdd = () => {
  // =========================
  // GET ID FROM URL
  // =========================

  const { id } = useParams();

  const navigate = useNavigate();

  // =========================
  // FORM DATA
  // =========================

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "AI & Software Engineering",
    level: "Beginner",
    duration: 4,
    durationUnit: "months",
    courseFee: 30000,
    registrationFee: 1000,
    certificateFee: 3000,
    images: [],
  });

  // =========================
  // STATES
  // =========================

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // INPUT CHANGE
  // =========================

  const update = (name, value) => {
    setForm((oldData) => ({
      ...oldData,
      [name]: value,
    }));
  };

  // =========================
  // GET COURSE FOR EDIT
  // =========================

  const getCourse = async () => {
    try {
      setLoading(true);

      const response = await apiFetch(`/api/courses/${id}`);

      const course = response.data;

      setForm({
        title: course.title || "",
        description: course.description || "",
        category: course.category || "General",
        level: course.level || "Beginner",

        duration: course.duration?.value || 4,

        durationUnit: course.duration?.unit || "months",

        courseFee: course.courseFee || 0,

        registrationFee: course.registrationFee || 0,

        certificateFee: course.certificateFee || 0,

        // New images select karne ke liye
        images: [],
      });

    } catch (error) {
      console.log(error);

      setError(
        error.message || "Unable to load course"
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // EDIT PAGE LOAD
  // =========================

  useEffect(() => {
    if (id) {
      getCourse();
    }
  }, [id]);

  // =========================
  // SUBMIT COURSE
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Basic validation
    if (!form.title.trim()) {
      setError("Course title is required");
      return;
    }

    if (!form.description.trim()) {
      setError("Course description is required");
      return;
    }

    try {
      setSaving(true);

      // =========================
      // FORM DATA
      // =========================

      const body = new FormData();

      body.append("title", form.title);

      body.append(
        "description",
        form.description
      );

      body.append(
        "shortDescription",
        form.description.slice(0, 300)
      );

      body.append(
        "category",
        form.category
      );

      body.append(
        "level",
        form.level
      );

      // Duration object
      body.append(
        "duration",
        JSON.stringify({
          value: Number(form.duration),
          unit: form.durationUnit,
        })
      );

      body.append(
        "courseFee",
        String(form.courseFee)
      );

      body.append(
        "registrationFee",
        String(form.registrationFee)
      );

      body.append(
        "certificateFee",
        String(form.certificateFee)
      );

      // Images
      form.images.forEach((image) => {
        body.append("images", image);
      });

      // =========================
      // API
      // =========================

      if (id) {
        // UPDATE
        await apiUpload(
          `/api/courses/${id}`,
          body,
          "PUT"
        );
      } else {
        // CREATE
        await apiUpload(
          "/api/courses",
          body,
          "POST"
        );
      }

      // =========================
      // AFTER SUCCESS
      // =========================

      navigate("/admin/courses");

    } catch (error) {
      console.log("Course Error:", error);

      setError(
        error.message || "Unable to save course"
      );

    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-slate-500">
          Loading course...
        </p>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-12">

      {/* BACK BUTTON */}

      <Link
        to="/admin/courses"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-orange-600"
      >
        <ArrowLeft className="h-4 w-4" />

        Back to courses
      </Link>

      {/* FORM CARD */}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

        {/* HEADER */}

        <div className="mb-8 flex items-center gap-3 border-b border-slate-100 pb-5">

          <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
            <BookOpen className="h-6 w-6" />
          </div>

          <div>

            <h1 className="text-2xl font-extrabold text-slate-900">
              {id ? "Edit Course" : "Add New Course"}
            </h1>

            <p className="text-sm text-slate-500">
              {id
                ? "Update course information."
                : "Create a new course."
              }
            </p>

          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="grid gap-5 sm:grid-cols-2"
        >

          {/* TITLE */}

          <div className="sm:col-span-2">

            <label className="text-sm font-semibold text-slate-700">
              Course Title
            </label>

            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                update("title", e.target.value)
              }
              placeholder="Enter course title"
              className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-orange-500"
            />

          </div>

          {/* DESCRIPTION */}

          <div className="sm:col-span-2">

            <label className="text-sm font-semibold text-slate-700">
              Description
            </label>

            <textarea
              rows="5"
              value={form.description}
              onChange={(e) =>
                update(
                  "description",
                  e.target.value
                )
              }
              placeholder="Enter course description"
              className="mt-1 w-full resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-orange-500"
            />

          </div>

          {/* CATEGORY */}

          <div>

            <label className="text-sm font-semibold text-slate-700">
              Category
            </label>

            <select
              value={form.category}
              onChange={(e) =>
                update("category", e.target.value)
              }
              className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-orange-500"
            >
              <option>
                AI & Software Engineering
              </option>

              <option>
                Artificial Intelligence
              </option>

              <option>
                Data Science
              </option>

              <option>
                Cybersecurity
              </option>

              <option>
                Web Development
              </option>
            </select>

          </div>

          {/* LEVEL */}

          <div>

            <label className="text-sm font-semibold text-slate-700">
              Level
            </label>

            <select
              value={form.level}
              onChange={(e) =>
                update("level", e.target.value)
              }
              className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-orange-500"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>All Levels</option>
            </select>

          </div>

          {/* DURATION */}

          <div>

            <label className="text-sm font-semibold text-slate-700">
              Duration
            </label>

            <input
              type="number"
              min="1"
              value={form.duration}
              onChange={(e) =>
                update("duration", e.target.value)
              }
              className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-orange-500"
            />

          </div>

          {/* DURATION UNIT */}

          <div>

            <label className="text-sm font-semibold text-slate-700">
              Duration Unit
            </label>

            <select
              value={form.durationUnit}
              onChange={(e) =>
                update(
                  "durationUnit",
                  e.target.value
                )
              }
              className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-orange-500"
            >
              <option>days</option>
              <option>weeks</option>
              <option>months</option>
              <option>years</option>
            </select>

          </div>

          {/* COURSE FEE */}

          <div>

            <label className="text-sm font-semibold text-slate-700">
              Course Fee
            </label>

            <input
              type="number"
              min="0"
              value={form.courseFee}
              onChange={(e) =>
                update(
                  "courseFee",
                  e.target.value
                )
              }
              className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-orange-500"
            />

          </div>

          {/* REGISTRATION FEE */}

          <div>

            <label className="text-sm font-semibold text-slate-700">
              Registration Fee
            </label>

            <input
              type="number"
              min="0"
              value={form.registrationFee}
              onChange={(e) =>
                update(
                  "registrationFee",
                  e.target.value
                )
              }
              className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-orange-500"
            />

          </div>

          {/* CERTIFICATE FEE */}

          <div>

            <label className="text-sm font-semibold text-slate-700">
              Certificate Fee
            </label>

            <input
              type="number"
              min="0"
              value={form.certificateFee}
              onChange={(e) =>
                update(
                  "certificateFee",
                  e.target.value
                )
              }
              className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-orange-500"
            />

          </div>

          {/* IMAGES */}

          <div className="sm:col-span-2">

            <label className="text-sm font-semibold text-slate-700">
              Course Images
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                update(
                  "images",
                  Array.from(e.target.files || [])
                )
              }
              className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm"
            />

            <p className="mt-1 text-xs text-slate-500">
              You can select multiple images.
            </p>

          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={saving}
            className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >

            <Save className="h-4 w-4" />

            {saving
              ? "Saving..."
              : id
                ? "Update Course"
                : "Save Course"
            }

          </button>

        </form>

      </div>

    </div>
  );
};