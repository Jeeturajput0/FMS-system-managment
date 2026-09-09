import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Users,
  UserCheck,
  UserX,
  RefreshCw,
  Loader2,
  Save,
  ClipboardCheck,
  AlertCircle,
} from "lucide-react";
import { apiFetch } from "../../../utils/api";

const today = new Date().toISOString().slice(0, 10);

const FranchiseAttendance = () => {
  const [batches, setBatches] = useState([]);
  const [batchId, setBatchId] = useState("");
  const [date, setDate] = useState(today);
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState("");
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [saving, setSaving] = useState(false);

  // =====================================================
  // FETCH BATCHES
  // =====================================================

  const fetchBatches = async () => {
    try {
      setLoadingBatches(true);
      setMessage("");

      const response = await apiFetch(
        "/api/batches/franchise/batches"
      );

      setBatches(response?.batches || []);
    } catch (error) {
      console.error("Error loading batches:", error);
      setMessage(error?.message || "Unable to load batches");
    } finally {
      setLoadingBatches(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  // =====================================================
  // FETCH ATTENDANCE
  // =====================================================

  useEffect(() => {
    if (!batchId) {
      setRecords([]);
      return;
    }

    const fetchAttendance = async () => {
      try {
        setLoadingRecords(true);
        setMessage("");

        const response = await apiFetch(
          `/api/portal/attendance?batchId=${batchId}&date=${date}`
        );

        const students =
          response?.data?.batch?.students || [];

        const saved = new Map(
          (response?.data?.attendance?.records || []).map(
            (record) => [
              String(record.studentId),
              record.status,
            ]
          )
        );

        setRecords(
          students.map((student) => ({
            studentId: student._id,
            name: student.name,
            email: student.email,
            status:
              saved.get(String(student._id)) || "PRESENT",
          }))
        );
      } catch (error) {
        console.error(
          "Error loading attendance:",
          error
        );

        setRecords([]);
        setMessage(
          error?.message || "Unable to load attendance"
        );
      } finally {
        setLoadingRecords(false);
      }
    };

    fetchAttendance();
  }, [batchId, date]);

  // =====================================================
  // ATTENDANCE COUNTS
  // =====================================================

  const attendanceStats = useMemo(() => {
    const total = records.length;

    const present = records.filter(
      (record) => record.status === "PRESENT"
    ).length;

    const absent = records.filter(
      (record) => record.status === "ABSENT"
    ).length;

    const late = records.filter(
      (record) => record.status === "LATE"
    ).length;

    const percentage =
      total > 0
        ? Math.round((present / total) * 100)
        : 0;

    return {
      total,
      present,
      absent,
      late,
      percentage,
    };
  }, [records]);

  // =====================================================
  // SELECTED BATCH
  // =====================================================

  const selectedBatch = useMemo(() => {
    return batches.find(
      (batch) => String(batch._id) === String(batchId)
    );
  }, [batches, batchId]);

  // =====================================================
  // UPDATE STATUS
  // =====================================================

  const updateStatus = (studentId, status) => {
    setRecords((currentRecords) =>
      currentRecords.map((record) =>
        record.studentId === studentId
          ? { ...record, status }
          : record
      )
    );

    setMessage("");
  };

  // =====================================================
  // MARK ALL
  // =====================================================

  const markAll = (status) => {
    setRecords((currentRecords) =>
      currentRecords.map((record) => ({
        ...record,
        status,
      }))
    );

    setMessage("");
  };

  // =====================================================
  // SAVE
  // =====================================================

  const save = async () => {
    if (!batchId || records.length === 0) return;

    try {
      setSaving(true);
      setMessage("");

      const response = await apiFetch(
        "/api/portal/attendance",
        {
          method: "PUT",
          body: JSON.stringify({
            batchId,
            date,
            records: records.map(
              ({ studentId, status }) => ({
                studentId,
                status,
              })
            ),
          }),
        }
      );

      setMessage(
        response?.message ||
          "Attendance saved successfully."
      );
    } catch (error) {
      console.error(
        "Error saving attendance:",
        error
      );

      setMessage(
        error?.message ||
          "Unable to save attendance"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // STATUS HELPERS
  // =====================================================

  const getInitial = (name) => {
    return (
      name?.trim()?.charAt(0)?.toUpperCase() || "S"
    );
  };

  const getAvatarColor = (index) => {
    const colors = [
      "from-blue-500 to-indigo-600",
      "from-purple-500 to-pink-600",
      "from-emerald-500 to-teal-600",
      "from-orange-500 to-red-500",
      "from-cyan-500 to-blue-600",
      "from-violet-500 to-indigo-600",
    ];

    return colors[index % colors.length];
  };

  return (
    <div className="min-h-full space-y-4 bg-slate-50/40">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-100">
            <ClipboardCheck size={20} />
          </div>

          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900">
              Attendance
            </h1>

            <p className="text-xs text-slate-500">
              Mark and manage daily student attendance.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchBatches}
          disabled={loadingBatches}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={14}
            className={
              loadingBatches ? "animate-spin" : ""
            }
          />
          Refresh
        </button>
      </div>

      {/* =================================================
          MESSAGE
      ================================================= */}

      {message && (
        <div
          className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold ${
            message.toLowerCase().includes("success")
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.toLowerCase().includes("success") ? (
            <CheckCircle2 size={15} />
          ) : (
            <AlertCircle size={15} />
          )}

          <span>{message}</span>
        </div>
      )}

      {/* =================================================
          FILTER CARD
      ================================================= */}

      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_180px]">
          {/* Batch */}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Select Batch
            </label>

            <div className="relative">
              <Users
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={batchId}
                onChange={(event) =>
                  setBatchId(event.target.value)
                }
                disabled={loadingBatches}
                className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-8 text-xs font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100 disabled:opacity-60"
              >
                <option value="">
                  {loadingBatches
                    ? "Loading batches..."
                    : "Select batch"}
                </option>

                {batches.map((batch) => (
                  <option
                    key={batch._id}
                    value={batch._id}
                  >
                    {batch.name}
                    {batch.code
                      ? ` (${batch.code})`
                      : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Attendance Date
            </label>

            <div className="relative">
              <CalendarDays
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="date"
                value={date}
                onChange={(event) =>
                  setDate(event.target.value)
                }
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        {/* Selected batch info */}
        {selectedBatch && (
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
            <span className="rounded-md bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700">
              {selectedBatch.name}
            </span>

            {selectedBatch.code && (
              <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
                {selectedBatch.code}
              </span>
            )}

            {selectedBatch.course?.title && (
              <span className="rounded-md bg-purple-50 px-2 py-1 text-[10px] font-bold text-purple-700">
                {selectedBatch.course.title}
              </span>
            )}
          </div>
        )}
      </div>

      {/* =================================================
          ATTENDANCE AREA
      ================================================= */}

      {loadingRecords && (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <Loader2
            size={26}
            className="mx-auto animate-spin text-blue-600"
          />

          <p className="mt-2 text-xs font-semibold text-slate-500">
            Loading students...
          </p>
        </div>
      )}

      {/* =================================================
          NO BATCH SELECTED
      ================================================= */}

      {!batchId && !loadingRecords && (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-600">
            <ClipboardCheck size={25} />
          </div>

          <h2 className="mt-4 text-base font-black text-slate-800">
            Select a batch
          </h2>

          <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
            Choose a batch and date to view and mark
            student attendance.
          </p>
        </div>
      )}

      {/* =================================================
          ATTENDANCE CONTENT
      ================================================= */}

      {!loadingRecords &&
        batchId &&
        records.length > 0 && (
          <div className="space-y-3">
            {/* Summary */}
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {/* Total */}
              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600">
                    <Users size={16} />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Total
                    </p>

                    <p className="text-lg font-black text-slate-900">
                      {attendanceStats.total}
                    </p>
                  </div>
                </div>
              </div>

              {/* Present */}
              <div className="rounded-xl border border-emerald-100 bg-white p-3 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                    <UserCheck size={16} />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Present
                    </p>

                    <p className="text-lg font-black text-emerald-600">
                      {attendanceStats.present}
                    </p>
                  </div>
                </div>
              </div>

              {/* Absent */}
              <div className="rounded-xl border border-red-100 bg-white p-3 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-red-50 text-red-600">
                    <UserX size={16} />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Absent
                    </p>

                    <p className="text-lg font-black text-red-600">
                      {attendanceStats.absent}
                    </p>
                  </div>
                </div>
              </div>

              {/* Late */}
              <div className="rounded-xl border border-amber-100 bg-white p-3 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-50 text-amber-600">
                    <Clock3 size={16} />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Late
                    </p>

                    <p className="text-lg font-black text-amber-600">
                      {attendanceStats.late}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Attendance percentage */}
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Attendance Rate
                  </p>

                  <p className="mt-0.5 text-xl font-black text-slate-900">
                    {attendanceStats.percentage}%
                  </p>
                </div>

                <div className="relative h-11 w-11">
                  <svg
                    className="h-11 w-11 -rotate-90"
                    viewBox="0 0 42 42"
                  >
                    <circle
                      cx="21"
                      cy="21"
                      r="16"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="4"
                    />

                    <circle
                      cx="21"
                      cy="21"
                      r="16"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray="100"
                      strokeDashoffset={
                        100 - attendanceStats.percentage
                      }
                    />
                  </svg>

                  <span className="absolute inset-0 grid place-items-center text-[9px] font-black text-blue-600">
                    %
                  </span>
                </div>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                  style={{
                    width: `${attendanceStats.percentage}%`,
                  }}
                />
              </div>
            </div>

            {/* =================================================
                STUDENT LIST
            ================================================= */}

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              {/* Table Header */}
              <div className="flex flex-col gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-sm font-black text-slate-900">
                    Student Attendance
                  </h2>

                  <p className="mt-0.5 text-[10px] text-slate-400">
                    {date} · {records.length} students
                  </p>
                </div>

                {/* Mark all */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      markAll("PRESENT")
                    }
                    className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[10px] font-bold text-emerald-700 transition hover:bg-emerald-100"
                  >
                    All Present
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      markAll("ABSENT")
                    }
                    className="rounded-lg bg-red-50 px-2.5 py-1.5 text-[10px] font-bold text-red-700 transition hover:bg-red-100"
                  >
                    All Absent
                  </button>
                </div>
              </div>

              {/* Mobile / Desktop Student Rows */}
              <div className="divide-y divide-slate-100">
                {records.map((record, index) => (
                  <div
                    key={record.studentId}
                    className="group flex flex-col gap-3 px-4 py-3 transition hover:bg-slate-50/70 sm:flex-row sm:items-center sm:justify-between"
                  >
                    {/* Student */}
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br text-xs font-black text-white shadow-sm ${getAvatarColor(
                          index
                        )}`}
                      >
                        {getInitial(record.name)}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-slate-800">
                          {record.name}
                        </p>

                        {record.email && (
                          <p className="truncate text-[10px] text-slate-400">
                            {record.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Status Buttons */}
                    <div className="grid grid-cols-3 gap-1.5 sm:w-[280px]">
                      <button
                        type="button"
                        onClick={() =>
                          updateStatus(
                            record.studentId,
                            "PRESENT"
                          )
                        }
                        className={`flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-[10px] font-bold transition-all ${
                          record.status === "PRESENT"
                            ? "border-emerald-500 bg-emerald-500 text-white shadow-sm shadow-emerald-100"
                            : "border-emerald-100 bg-emerald-50 text-emerald-700 hover:border-emerald-300"
                        }`}
                      >
                        <CheckCircle2 size={13} />
                        Present
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateStatus(
                            record.studentId,
                            "ABSENT"
                          )
                        }
                        className={`flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-[10px] font-bold transition-all ${
                          record.status === "ABSENT"
                            ? "border-red-500 bg-red-500 text-white shadow-sm shadow-red-100"
                            : "border-red-100 bg-red-50 text-red-700 hover:border-red-300"
                        }`}
                      >
                        <UserX size={13} />
                        Absent
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateStatus(
                            record.studentId,
                            "LATE"
                          )
                        }
                        className={`flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-[10px] font-bold transition-all ${
                          record.status === "LATE"
                            ? "border-amber-500 bg-amber-500 text-white shadow-sm shadow-amber-100"
                            : "border-amber-100 bg-amber-50 text-amber-700 hover:border-amber-300"
                        }`}
                      >
                        <Clock3 size={13} />
                        Late
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Save Footer */}
              <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <ClipboardCheck
                    size={14}
                    className="text-blue-500"
                  />

                  <span>
                    Review attendance before saving.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={save}
                  disabled={saving}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 text-xs font-bold text-white shadow-sm shadow-blue-100 transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2
                      size={14}
                      className="animate-spin"
                    />
                  ) : (
                    <Save size={14} />
                  )}

                  {saving
                    ? "Saving..."
                    : "Save Attendance"}
                </button>
              </div>
            </div>
          </div>
        )}

      {/* =================================================
          NO STUDENTS
      ================================================= */}

      {!loadingRecords &&
        batchId &&
        records.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
              <Users size={25} />
            </div>

            <h2 className="mt-4 text-base font-black text-slate-800">
              No students assigned
            </h2>

            <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
              There are no students assigned to this
              batch for attendance.
            </p>
          </div>
        )}
    </div>
  );
};

export default FranchiseAttendance;