import { useEffect, useState } from "react";
import { apiFetch } from "../../../utils/api";

const fields = [
  ["name", "Franchise name"],
  ["ownerName", "Owner name"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["address", "Address"],
  ["city", "City"],
  ["state", "State"],
  ["pincode", "Pincode"],
  ["logo", "Logo URL"],
];

const FranchiseSettings = () => {
  const [form, setForm] = useState({});
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/api/portal/settings")
      .then((response) => setForm(response.data || {}))
      .catch((error) => setStatus(error.message))
      .finally(() => setLoading(false));
  }, []);

  const save = async (event) => {
    event.preventDefault();
    setStatus("");
    try {
      const response = await apiFetch("/api/portal/settings", {
        method: "PUT",
        body: JSON.stringify(form),
      });
      setForm(response.data || form);
      setStatus("Settings saved successfully.");
    } catch (error) {
      setStatus(error.message);
    }
  };

  if (loading)
    return <p className="text-sm text-slate-500">Loading settings...</p>;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Settings</h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage your franchise information and contact details.
        </p>
      </div>
      {status && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
          {status}
        </div>
      )}
      <form
        onSubmit={save}
        className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-2"
      >
        {fields.map(([key, label]) => (
          <label key={key} className={key === "address" ? "sm:col-span-2" : ""}>
            <span className="mb-1 block text-sm font-semibold text-slate-700">
              {label}
            </span>
            {key === "address" ? (
              <textarea
                value={form[key] || ""}
                onChange={(event) =>
                  setForm({ ...form, [key]: event.target.value })
                }
                className="min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
              />
            ) : (
              <input
                value={form[key] || ""}
                onChange={(event) =>
                  setForm({ ...form, [key]: event.target.value })
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
              />
            )}
          </label>
        ))}
        <div className="sm:col-span-2">
          <button className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white">
            Save settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default FranchiseSettings;
