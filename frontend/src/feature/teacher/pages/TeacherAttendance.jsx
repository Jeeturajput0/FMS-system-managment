
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Loader2,
  Search,
  Users,
  X,
  UserCheck,
} from "lucide-react";
import { apiFetch } from "../../../utils/api";

const TeacherAttendance = () => {
  const [batches, setBatches] = useState([]);
  const [batchId, setBatchId] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiFetch("/api/portal/teacher-batches")
      .then((response) => setBatches(response.data || []))
      .catch((error) => setMessage(error.message || "Failed to load batches"))
      .finally(() => setLoadingBatches(false));
  }, []);

  const selectedBatch = useMemo(
    () => batches.find((batch) => String(batch._id) === String(batchId)),
    [batches, batchId]
  );

  const load = async () => {
    if (!batchId) {
      setMessage("Please select a batch first.");
      return;
    }

    setLoadingStudents(true);
    setMessage("");
    setRecords([]);

    try {
      const response = await apiFetch(
        `/api/portal/attendance?batchId=${batchId}&date=${date}`
      );

      const saved = new Map(
        (response.data.attendance?.records || []).map((item) => [
          String(item.studentId),
          item.status,
        ])
      );

      const students = response.data.batch?.students || [];

      setRecords(
        students.map((student) => ({
          studentId: student._id,
          name: student.name,
          status:
            saved.get(String(student._id)) || "PRESENT",
        }))
      );
    } catch (error) {
      setMessage(error.message || "Failed to load attendance");
    } finally {
      setLoadingStudents(false);
    }
  };

  const updateStatus = (studentId, status) => {
    setRecords((currentRecords) =>
      currentRecords.map((record) =>
        String(record.studentId) === String(studentId)
          ? { ...record, status }
          : record
      )
    );
  };

  const togglePresent = (studentId) => {
    setRecords((currentRecords) =>
      currentRecords.map((record) =>
        String(record.studentId) === String(studentId)
          ? {
              ...record,
              status:
                record.status === "PRESENT"
                  ? "ABSENT"
                  : "PRESENT",
            }
          : record
      )
    );
  };

  const markAllPresent = () => {
    setRecords((currentRecords) =>
      currentRecords.map((record) => ({
        ...record,
        status: "PRESENT",
      }))
    );
  };

  const markAllAbsent = () => {
    setRecords((currentRecords) =>
      currentRecords.map((record) => ({
        ...record,
        status: "ABSENT",
      }))
    );
  };

  const save = async () => {
    if (!batchId || !records.length) return;

    setSaving(true);
    setMessage("");

    try {
      const response = await apiFetch("/api/portal/attendance", {
        method: "PUT",
        body: JSON.stringify({
          batchId,
          date,
          records: records.map(({ studentId, status }) => ({
            studentId,
            status,
          })),
        }),
      });

      setMessage(response.message || "Attendance saved successfully.");
    } catch (error) {
      setMessage(error.message || "Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return records;

    return records.filter((record) =>
      `${record.name || ""} ${record.studentId || ""}`
        .toLowerCase()
        .includes(query)
    );
  }, [records, search]);

  const presentCount = records.filter(
    (record) => record.status === "PRESENT"
  ).length;

  const absentCount = records.filter(
    (record) => record.status === "ABSENT"
  ).length;

  const lateCount = records.filter(
    (record) => record.status === "LATE"
  ).length;

  const totalCount = records.length;

  const presentPercentage = totalCount
    ? Math.round((presentCount / totalCount) * 100)
    : 0;

  return (
    <div className="min-h-full space-y-6 bg-slate-50/40">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-blue-700">
              <ClipboardCheck size={14} />
              Attendance Management
            </div>

            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Mark Attendance
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Select your batch and date, then mark each student's attendance.
            </p>
          </div>

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
            <ClipboardCheck size={27} />
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`rounded-2xl border px-5 py-4 text-sm font-semibold ${
            message.toLowerCase().includes("success")
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-slate-200 bg-white text-slate-600"
          }`}
        >
          {message}
        </div>
      )}

      {/* Filters */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
            <CalendarDays size={19} />
          </div>

          <div>
            <h2 className="font-black text-slate-900">
              Attendance Setup
            </h2>
            <p className="text-xs text-slate-500">
              Choose batch and attendance date
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_220px_180px]">
          {/* Batch */}
          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
              Select Batch
            </label>

            <select
              value={batchId}
              onChange={(event) => {
                setBatchId(event.target.value);
                setRecords([]);
                setMessage("");
              }}
              disabled={loadingBatches}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">
                {loadingBatches
                  ? "Loading batches..."
                  : "Select batch"}
              </option>

              {batches.map((batch) => (
                <option key={batch._id} value={batch._id}>
                  {batch.name}
                  {batch.code ? ` (${batch.code})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
              Attendance Date
            </label>

            <input
              type="date"
              value={date}
              onChange={(event) => {
                setDate(event.target.value);
                setRecords([]);
                setMessage("");
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
            />
          </div>

          {/* Load */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={load}
              disabled={loadingStudents || !batchId}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingStudents ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Users size={17} />
                  Load Students
                </>
              )}
            </button>
          </div>
        </div>

        {/* Selected Batch */}
        {selectedBatch && (
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl bg-slate-50 px-4 py-3 text-xs">
            <span className="font-bold text-slate-500">
              Batch:
              <span className="ml-1 font-black text-slate-800">
                {selectedBatch.name}
              </span>
            </span>

            {selectedBatch.code && (
              <span className="font-bold text-slate-500">
                Code:
                <span className="ml-1 font-black text-slate-800">
                  {selectedBatch.code}
                </span>
              </span>
            )}

            <span className="font-bold text-slate-500">
              Date:
              <span className="ml-1 font-black text-slate-800">
                {date}
              </span>
            </span>
          </div>
        )}
      </div>

      {/* Statistics */}
      {records.length > 0 && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {/* Total */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Total
                </p>
                <p className="mt-1 text-2xl font-black text-slate-900">
                  {totalCount}
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                <Users size={19} />
              </div>
            </div>
          </div>

          {/* Present */}
          <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-emerald-500">
                  Present
                </p>
                <p className="mt-1 text-2xl font-black text-emerald-700">
                  {presentCount}
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                <CheckCircle2 size={19} />
              </div>
            </div>
          </div>

          {/* Absent */}
          <div className="rounded-2xl border border-red-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-red-500">
                  Absent
                </p>
                <p className="mt-1 text-2xl font-black text-red-700">
                  {absentCount}
                </p>
              </div>

              <div className="rounded-xl bg-red-50 p-2.5 text-red-600">
                <X size={19} />
              </div>
            </div>
          </div>

          {/* Late */}
          <div className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-amber-500">
                  Late
                </p>
                <p className="mt-1 text-2xl font-black text-amber-700">
                  {lateCount}
                </p>
              </div>

              <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
                <Clock3 size={19} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attendance List */}
      {records.length > 0 && (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* List Header */}
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Student Attendance
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {presentPercentage}% students currently marked present
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={markAllPresent}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-2.5 text-xs font-black text-emerald-700 transition hover:bg-emerald-100"
                >
                  <Check size={15} />
                  All Present
                </button>

                <button
                  type="button"
                  onClick={markAllAbsent}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-3.5 py-2.5 text-xs font-black text-red-700 transition hover:bg-red-100"
                >
                  <X size={15} />
                  All Absent
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="relative mt-5">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search student by name or ID..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/80">
                <tr className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Student ID</th>
                  <th className="px-6 py-4">Attendance</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((record, index) => {
                  const isPresent = record.status === "PRESENT";

                  return (
                    <tr
                      key={record.studentId}
                      className="transition hover:bg-slate-50/70"
                    >
                      {/* Number */}
                      <td className="px-6 py-4 text-xs font-bold text-slate-400">
                        {String(index + 1).padStart(2, "0")}
                      </td>

                      {/* Student */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-sm font-black text-blue-700">
                            {(record.name || "S")
                              .trim()
                              .split(" ")
                              .slice(0, 2)
                              .map((word) => word[0])
                              .join("")
                              .toUpperCase()}
                          </div>

                          <div>
                            <p className="font-bold text-slate-900">
                              {record.name || "Unnamed Student"}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              Student
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Student ID */}
                      <td className="px-6 py-4">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 font-mono text-xs font-bold text-slate-600">
                          {record.studentId || "-"}
                        </span>
                      </td>

                      {/* Checkbox + Status */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {/* Present checkbox */}
                          <button
                            type="button"
                            onClick={() =>
                              togglePresent(record.studentId)
                            }
                            className={`flex h-9 w-9 items-center justify-center rounded-xl border-2 transition ${
                              isPresent
                                ? "border-emerald-500 bg-emerald-500 text-white shadow-sm shadow-emerald-200"
                                : "border-slate-300 bg-white text-transparent hover:border-emerald-400"
                            }`}
                            title={
                              isPresent
                                ? "Mark absent"
                                : "Mark present"
                            }
                          >
                            <Check size={18} strokeWidth={3} />
                          </button>

                          {/* Status selector */}
                          <select
                            value={record.status}
                            onChange={(event) =>
                              updateStatus(
                                record.studentId,
                                event.target.value
                              )
                            }
                            className={`rounded-xl border px-3 py-2 text-xs font-black outline-none ${
                              record.status === "PRESENT"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : record.status === "ABSENT"
                                ? "border-red-200 bg-red-50 text-red-700"
                                : "border-amber-200 bg-amber-50 text-amber-700"
                            }`}
                          >
                            <option value="PRESENT">
                              PRESENT
                            </option>
                            <option value="ABSENT">
                              ABSENT
                            </option>
                            <option value="LATE">
                              LATE
                            </option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile List */}
          <div className="divide-y divide-slate-100 md:hidden">
            {filteredRecords.map((record, index) => {
              const isPresent = record.status === "PRESENT";

              return (
                <div key={record.studentId} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-sm font-black text-blue-700">
                      {(record.name || "S")
                        .trim()
                        .split(" ")
                        .slice(0, 2)
                        .map((word) => word[0])
                        .join("")
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-black text-slate-900">
                        {record.name || "Unnamed Student"}
                      </p>

                      <p className="mt-1 font-mono text-[11px] text-slate-400">
                        ID: {record.studentId || "-"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        togglePresent(record.studentId)
                      }
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 transition ${
                        isPresent
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-slate-300 bg-white text-transparent"
                      }`}
                    >
                      <Check size={19} strokeWidth={3} />
                    </button>
                  </div>

                  <div className="mt-3">
                    <select
                      value={record.status}
                      onChange={(event) =>
                        updateStatus(
                          record.studentId,
                          event.target.value
                        )
                      }
                      className={`w-full rounded-xl border px-3 py-3 text-xs font-black outline-none ${
                        record.status === "PRESENT"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : record.status === "ABSENT"
                          ? "border-red-200 bg-red-50 text-red-700"
                          : "border-amber-200 bg-amber-50 text-amber-700"
                      }`}
                    >
                      <option value="PRESENT">
                        ✓ PRESENT
                      </option>
                      <option value="ABSENT">
                        ✕ ABSENT
                      </option>
                      <option value="LATE">
                        ◷ LATE
                      </option>
                    </select>
                  </div>

                  <p className="mt-2 text-right text-[10px] font-bold text-slate-300">
                    #{String(index + 1).padStart(2, "0")}
                  </p>
                </div>
              );
            })}

            {!filteredRecords.length && (
              <div className="p-10 text-center">
                <Search
                  size={25}
                  className="mx-auto text-slate-300"
                />
                <p className="mt-3 text-sm font-bold text-slate-600">
                  No student found
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-4 border-t border-slate-100 bg-slate-50/60 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <UserCheck size={19} />
              </div>

              <div>
                <p className="text-xs font-black text-slate-700">
                  {presentCount} of {totalCount} present
                </p>

                <p className="text-[11px] text-slate-400">
                  Review attendance before saving
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 size={17} />
                  Save Attendance
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Initial Empty State */}
      {!loadingStudents && !records.length && !message && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-14 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
            <ClipboardCheck size={30} />
          </div>

          <h2 className="mt-5 text-lg font-black text-slate-800">
            Ready to mark attendance
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Select a batch and date above, then click{" "}
            <b>Load Students</b> to start marking attendance.
          </p>
        </div>
      )}
    </div>
  );
};

export default TeacherAttendance;
