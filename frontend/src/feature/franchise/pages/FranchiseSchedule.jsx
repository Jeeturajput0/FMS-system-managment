import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  DoorOpen,
  Users,
  BookOpen,
  UserRound,
  RefreshCw,
  Loader2,
  Search,
  X,
  Eye,
} from "lucide-react";
import { apiFetch } from "../../../utils/api";

const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

const DAY_SHORT = {
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thu",
  FRIDAY: "Fri",
  SATURDAY: "Sat",
  SUNDAY: "Sun",
};

const DAY_COLORS = {
  MONDAY: "bg-blue-50 text-blue-700 border-blue-100",
  TUESDAY: "bg-purple-50 text-purple-700 border-purple-100",
  WEDNESDAY: "bg-emerald-50 text-emerald-700 border-emerald-100",
  THURSDAY: "bg-amber-50 text-amber-700 border-amber-100",
  FRIDAY: "bg-pink-50 text-pink-700 border-pink-100",
  SATURDAY: "bg-indigo-50 text-indigo-700 border-indigo-100",
  SUNDAY: "bg-slate-100 text-slate-600 border-slate-200",
};

const STATUS_STYLES = {
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-100",
  COMPLETED: "bg-blue-50 text-blue-700 border-blue-100",
  CANCELLED: "bg-red-50 text-red-700 border-red-100",
  INACTIVE: "bg-amber-50 text-amber-700 border-amber-100",
};

const FranchiseSchedule = () => {
  const [batches, setBatches] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDay, setSelectedDay] = useState("ALL");
  const [viewBatch, setViewBatch] = useState(null);

  // =====================================================
  // FETCH SCHEDULE
  // =====================================================

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiFetch(
        "/api/batches/franchise/batches?limit=100"
      );

      setBatches(response?.batches || []);
    } catch (requestError) {
      console.error("Error loading schedule:", requestError);

      setError(
        requestError?.message || "Unable to load schedule"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredBatches = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query && selectedDay === "ALL") return batches;

    return batches.filter((batch) => {
      const matchesDay = selectedDay === "ALL" || (batch?.days || []).includes(selectedDay);
      if (!matchesDay) return false;
      const values = [
        batch?.name,
        batch?.batchName,
        batch?.code,

        batch?.course?.title,
        batch?.course?.name,
        batch?.courseName,

        batch?.teacher?.name,
        batch?.teacherName,

        batch?.room,

        ...(batch?.days || []),
      ];

      return values.some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [batches, search, selectedDay]);

  // =====================================================
  // TOTAL SCHEDULED DAYS
  // =====================================================

  const totalScheduledDays = useMemo(() => {
    return batches.reduce(
      (total, batch) =>
        total + (batch?.days?.length || 0),
      0
    );
  }, [batches]);

  // =====================================================
  // UNIQUE TEACHERS
  // =====================================================

  const totalTeachers = useMemo(() => {
    const teachers = batches
      .map(
        (batch) =>
          batch?.teacher?._id ||
          batch?.teacher ||
          batch?.teacherName
      )
      .filter(Boolean);

    return new Set(
      teachers.map(String)
    ).size;
  }, [batches]);

  // =====================================================
  // ACTIVE BATCHES
  // =====================================================

  const activeBatches = useMemo(() => {
    return batches.filter(
      (batch) => batch?.status === "ACTIVE"
    ).length;
  }, [batches]);

  // =====================================================
  // CREATE SCHEDULE ROWS
  // =====================================================

  const scheduleRows = useMemo(() => {
    const rows = [];

    filteredBatches.forEach((batch) => {
      const days = Array.isArray(batch?.days)
        ? batch.days
        : [];

      const batchName =
        batch?.name ||
        batch?.batchName ||
        "Unnamed Batch";

      const courseName =
        batch?.course?.title ||
        batch?.course?.name ||
        batch?.courseName ||
        "Course not assigned";

      const teacherName =
        batch?.teacher?.name ||
        batch?.teacherName ||
        "Teacher not assigned";

      const time =
        batch?.startTime && batch?.endTime
          ? `${batch.startTime} - ${batch.endTime}`
          : "Time not set";

      const room =
        batch?.room || "Room not assigned";

      const status =
        batch?.status || "ACTIVE";

      const studentCount =
        batch?.studentCount ??
        batch?.students?.length ??
        0;

      // Every scheduled day becomes one row
      days.forEach((day) => {
        rows.push({
          id: `${batch?._id}-${day}`,
          batchId: batch?._id,
          day,
          batchName,
          courseName,
          teacherName,
          time,
          room,
          status,
          studentCount,
          code: batch?.code,
          originalBatch: batch,
        });
      });
    });

    // Monday -> Sunday
    // Same day -> time order
    rows.sort((a, b) => {
      const dayA = DAYS.indexOf(a.day);
      const dayB = DAYS.indexOf(b.day);

      if (dayA !== dayB) {
        return dayA - dayB;
      }

      return String(a.time).localeCompare(
        String(b.time)
      );
    });

    return rows;
  }, [filteredBatches]);

  // =====================================================
  // GROUP ROWS BY DAY
  // =====================================================

  const groupedSchedule = useMemo(() => {
    return DAYS.map((day) => ({
      day,
      rows: scheduleRows.filter(
        (row) => row.day === day
      ),
    })).filter((group) => group.rows.length > 0);
  }, [scheduleRows]);

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    return (
      STATUS_STYLES[status] ||
      "bg-slate-50 text-slate-600 border-slate-100"
    );
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-full space-y-4 bg-slate-50/40">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">

          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-100">
            <CalendarDays size={19} />
          </div>

          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900">
              Schedule
            </h1>

            <p className="text-xs text-slate-500">
              Weekly timetable for your franchise batches.
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={fetchSchedule}
          disabled={loading}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={14}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-3 py-2.5">

          <p className="text-xs font-semibold text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={() => setError("")}
            className="rounded-lg p-1 text-red-500 transition hover:bg-red-100"
          >
            <X size={15} />
          </button>

        </div>
      )}

      {/* =================================================
          STATS
      ================================================= */}

      {!loading && (
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">

          {/* Batches */}

          <div className="rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

            <div className="flex items-center gap-2.5">

              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
                <BookOpen size={16} />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Batches
                </p>

                <p className="mt-0.5 text-lg font-black text-slate-900">
                  {batches.length}
                </p>
              </div>

            </div>

          </div>

          {/* Scheduled */}

          <div className="rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

            <div className="flex items-center gap-2.5">

              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-600">
                <CalendarDays size={16} />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Scheduled
                </p>

                <p className="mt-0.5 text-lg font-black text-indigo-600">
                  {totalScheduledDays}
                </p>
              </div>

            </div>

          </div>

          {/* Teachers */}

          <div className="rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

            <div className="flex items-center gap-2.5">

              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-purple-50 text-purple-600">
                <UserRound size={16} />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Teachers
                </p>

                <p className="mt-0.5 text-lg font-black text-purple-600">
                  {totalTeachers}
                </p>
              </div>

            </div>

          </div>

          {/* Active */}

          <div className="rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

            <div className="flex items-center gap-2.5">

              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-50">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Active
                </p>

                <p className="mt-0.5 text-lg font-black text-emerald-600">
                  {activeBatches}
                </p>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* =================================================
          SEARCH
      ================================================= */}

      {!loading && batches.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">

          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">

            <div className="relative w-full sm:max-w-md">

              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search batch, course, teacher, room or day..."
                className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-9 text-xs font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X size={14} />
                </button>
              )}

            </div>

            <p className="text-xs text-slate-400">
              Showing{" "}
              <span className="font-bold text-slate-700">
                {scheduleRows.length}
              </span>{" "}
              schedule entries
            </p>

          </div>

          <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
            <button type="button" onClick={() => setSelectedDay("ALL")} className={`rounded-lg px-3 py-2 text-xs font-bold ${selectedDay === "ALL" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>All Week</button>
            {DAYS.map((day) => <button key={day} type="button" onClick={() => setSelectedDay(day)} className={`rounded-lg px-3 py-2 text-xs font-bold ${selectedDay === day ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>{day.charAt(0) + day.slice(1).toLowerCase()}</button>)}
          </div>

        </div>
      )}

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">

          <Loader2
            size={26}
            className="mx-auto animate-spin text-blue-600"
          />

          <p className="mt-2 text-xs font-semibold text-slate-500">
            Loading schedule...
          </p>

        </div>
      )}

      {/* =================================================
          NO DATA
      ================================================= */}

      {!loading &&
        !error &&
        batches.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">

            <div className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <CalendarDays size={24} />
            </div>

            <h2 className="mt-4 text-base font-black text-slate-800">
              No scheduled batches
            </h2>

            <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
              No batches have been scheduled for this franchise yet.
            </p>

          </div>
        )}

      {/* =================================================
          SEARCH EMPTY
      ================================================= */}

      {!loading &&
        !error &&
        batches.length > 0 &&
        scheduleRows.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">

            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-slate-100">
              <Search
                size={21}
                className="text-slate-400"
              />
            </div>

            <h3 className="mt-3 text-sm font-bold text-slate-800">
              No schedule found
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Try another batch, course, teacher, day or room.
            </p>

            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-3 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 transition hover:bg-blue-100"
            >
              Clear Search
            </button>

          </div>
        )}

      {/* =================================================
          GROUPED DAY TABLE
      ================================================= */}

      {!loading &&
        !error &&
        groupedSchedule.length > 0 && (

          <div className="space-y-5">

            {groupedSchedule.map((group) => (

              <div
                key={group.day}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >

                {/* ==========================================
                    DAY HEADER
                ========================================== */}

                <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-blue-50 via-white to-indigo-50 px-4 py-3.5 sm:px-5">

                  <div className="flex items-center gap-3">

                    <div
                      className={`grid h-10 w-10 place-items-center rounded-xl border text-[10px] font-black ${
                        DAY_COLORS[group.day]
                      }`}
                    >
                      {DAY_SHORT[group.day]}
                    </div>

                    <div>

                      <h2 className="text-sm font-black uppercase tracking-wide text-slate-900">
                        {group.day}
                      </h2>

                      <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                        {group.rows.length}{" "}
                        {group.rows.length === 1
                          ? "batch"
                          : "batches"}{" "}
                        scheduled
                      </p>

                    </div>

                  </div>

                  <div className="hidden items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-bold text-slate-500 shadow-sm sm:flex">

                    <CalendarDays
                      size={13}
                      className="text-blue-500"
                    />

                    {group.day}

                  </div>

                </div>

                {/* ==========================================
                    TABLE
                ========================================== */}

                <div className="w-full overflow-x-auto">

                  <table className="w-full min-w-[1050px] border-collapse">

                    {/* TABLE HEADER */}

                    <thead>

                      <tr className="border-b border-slate-200 bg-slate-50">

                        <th className="w-[7%] px-4 py-3.5 text-center text-[10px] font-black uppercase tracking-wider text-slate-500">
                          S.No.
                        </th>

                        <th className="w-[16%] px-4 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
                          Timing
                        </th>

                        <th className="w-[18%] px-4 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
                          Batch Name
                        </th>

                        <th className="w-[20%] px-4 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
                          Course
                        </th>

                        <th className="w-[15%] px-4 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
                          Teacher
                        </th>

                        <th className="w-[11%] px-4 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
                          Room No.
                        </th>

                        <th className="w-[9%] px-4 py-3.5 text-center text-[10px] font-black uppercase tracking-wider text-slate-500">
                          Status
                        </th>

                        <th className="w-[9%] px-4 py-3.5 text-center text-[10px] font-black uppercase tracking-wider text-slate-500">
                          Action
                        </th>

                      </tr>

                    </thead>

                    {/* TABLE BODY */}

                    <tbody className="divide-y divide-slate-100">

                      {group.rows.map((row, rowIndex) => {

                        /*
                         * Continuous S.No.
                         *
                         * Example:
                         * Monday = 1,2
                         * Tuesday = 3,4
                         * Wednesday = 5...
                         */

                        const globalIndex =
                          scheduleRows.findIndex(
                            (item) =>
                              item.id === row.id
                          ) + 1;

                        return (
                          <tr
                            key={row.id}
                            className="group transition-all hover:bg-blue-50/40"
                          >

                            {/* S.NO */}

                            <td className="px-4 py-4 text-center align-middle">

                              <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-lg bg-slate-100 px-2 text-[11px] font-black text-slate-600 transition group-hover:bg-blue-100 group-hover:text-blue-700">
                                {globalIndex}
                              </span>

                            </td>

                            {/* TIMING */}

                            <td className="px-4 py-4 align-middle">

                              <div className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-2.5 py-2 text-xs font-bold text-blue-700">

                                <Clock3 size={14} />

                                <span className="whitespace-nowrap">
                                  {row.time}
                                </span>

                              </div>

                            </td>

                            {/* BATCH NAME */}

                            <td className="px-4 py-4 align-middle">

                              <div className="flex items-center gap-2.5">

                                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-black text-white shadow-sm">
                                  {row.batchName
                                    ?.charAt(0)
                                    ?.toUpperCase() ||
                                    "B"}
                                </div>

                                <div className="min-w-0">

                                  <p className="max-w-[180px] truncate text-xs font-black text-slate-800">
                                    {row.batchName}
                                  </p>

                                  {row.code && (
                                    <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-400">
                                      {row.code}
                                    </p>
                                  )}

                                </div>

                              </div>

                            </td>

                            {/* COURSE */}

                            <td className="px-4 py-4 align-middle">

                              <div className="flex items-center gap-2">

                                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-purple-50 text-purple-600">
                                  <BookOpen size={14} />
                                </div>

                                <p className="max-w-[220px] truncate text-xs font-semibold text-slate-700">
                                  {row.courseName}
                                </p>

                              </div>

                            </td>

                            {/* TEACHER */}

                            <td className="px-4 py-4 align-middle">

                              <div className="flex items-center gap-2">

                                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-600">
                                  <UserRound size={14} />
                                </div>

                                <p className="max-w-[150px] truncate text-xs font-semibold text-slate-700">
                                  {row.teacherName}
                                </p>

                              </div>

                            </td>

                            {/* ROOM */}

                            <td className="px-4 py-4 align-middle">

                              <div className="inline-flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-2">

                                <DoorOpen
                                  size={14}
                                  className="text-amber-500"
                                />

                                <span className="whitespace-nowrap text-xs font-bold text-slate-700">
                                  {row.room}
                                </span>

                              </div>

                            </td>

                            {/* STATUS */}

                            <td className="px-4 py-4 text-center align-middle">

                              <span
                                className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-wide ${getStatusStyle(
                                  row.status
                                )}`}
                              >
                                {row.status}
                              </span>

                            </td>

                            {/* ACTION */}

                            <td className="px-4 py-4 text-center align-middle">

                              <button
                                type="button"
                                onClick={() =>
                                  setViewBatch(
                                    row.originalBatch
                                  )
                                }
                                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-[10px] font-black text-blue-600 transition-all hover:border-blue-200 hover:bg-blue-600 hover:text-white hover:shadow-md hover:shadow-blue-100 active:scale-95"
                              >
                                <Eye size={14} />
                                View
                              </button>

                            </td>

                          </tr>
                        );
                      })}

                    </tbody>

                  </table>

                </div>

                {/* DAY FOOTER */}

                <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-2.5">

                  <span className="text-[10px] font-medium text-slate-400">
                    {group.day} schedule
                  </span>

                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">

                    <Users
                      size={12}
                      className="text-slate-400"
                    />

                    {group.rows.reduce(
                      (total, row) =>
                        total + row.studentCount,
                      0
                    )}{" "}
                    Students

                  </span>

                </div>

              </div>

            ))}

          </div>
        )}

      {/* =================================================
          VIEW MODAL
      ================================================= */}

      {viewBatch && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={() => setViewBatch(null)}
        >

          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-4">

              <div>

                <p className="text-[9px] font-black uppercase tracking-widest text-blue-500">
                  Batch Details
                </p>

                <h2 className="mt-1 text-lg font-black text-slate-900">
                  {viewBatch?.name ||
                    viewBatch?.batchName ||
                    "Batch Details"}
                </h2>

              </div>

              <button
                type="button"
                onClick={() =>
                  setViewBatch(null)
                }
                className="grid h-9 w-9 place-items-center rounded-xl bg-white text-slate-500 shadow-sm transition hover:bg-red-50 hover:text-red-500"
              >
                <X size={17} />
              </button>

            </div>

            {/* MODAL BODY */}

            <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">

              {/* Course */}

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">

                <div className="flex items-center gap-3">

                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-50 text-purple-600">
                    <BookOpen size={18} />
                  </div>

                  <div>

                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Course
                    </p>

                    <p className="mt-1 text-sm font-black text-slate-800">
                      {viewBatch?.course?.title ||
                        viewBatch?.course?.name ||
                        viewBatch?.courseName ||
                        "Course not assigned"}
                    </p>

                  </div>

                </div>

              </div>

              {/* Teacher */}

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">

                <div className="flex items-center gap-3">

                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                    <UserRound size={18} />
                  </div>

                  <div>

                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Teacher
                    </p>

                    <p className="mt-1 text-sm font-black text-slate-800">
                      {viewBatch?.teacher?.name ||
                        viewBatch?.teacherName ||
                        "Teacher not assigned"}
                    </p>

                  </div>

                </div>

              </div>

              {/* Timing */}

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">

                <div className="flex items-center gap-3">

                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
                    <Clock3 size={18} />
                  </div>

                  <div>

                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Timing
                    </p>

                    <p className="mt-1 text-sm font-black text-slate-800">
                      {viewBatch?.startTime &&
                      viewBatch?.endTime
                        ? `${viewBatch.startTime} - ${viewBatch.endTime}`
                        : "Time not set"}
                    </p>

                  </div>

                </div>

              </div>

              {/* Room */}

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">

                <div className="flex items-center gap-3">

                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600">
                    <DoorOpen size={18} />
                  </div>

                  <div>

                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Room No.
                    </p>

                    <p className="mt-1 text-sm font-black text-slate-800">
                      {viewBatch?.room ||
                        "Room not assigned"}
                    </p>

                  </div>

                </div>

              </div>

              {/* Students */}

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">

                <div className="flex items-center gap-3">

                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Users size={18} />
                  </div>

                  <div>

                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Students
                    </p>

                    <p className="mt-1 text-sm font-black text-slate-800">
                      {viewBatch?.studentCount ??
                        viewBatch?.students?.length ??
                        0}
                    </p>

                  </div>

                </div>

              </div>

              {/* Status */}

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">

                <div className="flex items-center gap-3">

                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </div>

                  <div>

                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Status
                    </p>

                    <span
                      className={`mt-1 inline-flex rounded-full border px-2.5 py-1 text-[9px] font-black ${getStatusStyle(
                        viewBatch?.status ||
                          "ACTIVE"
                      )}`}
                    >
                      {viewBatch?.status ||
                        "ACTIVE"}
                    </span>

                  </div>

                </div>

              </div>

            </div>

            {/* WEEKLY DAYS */}

            <div className="border-t border-slate-100 px-5 py-4">

              <p className="mb-2 text-[9px] font-black uppercase tracking-wider text-slate-400">
                Weekly Days
              </p>

              <div className="flex flex-wrap gap-2">

                {(viewBatch?.days || []).map(
                  (day) => (
                    <span
                      key={day}
                      className={`rounded-lg border px-3 py-1.5 text-[10px] font-black ${
                        DAY_COLORS[day] ||
                        "bg-slate-50 text-slate-600 border-slate-200"
                      }`}
                    >
                      {day}
                    </span>
                  )
                )}

              </div>

            </div>

            {/* MODAL FOOTER */}

            <div className="flex justify-end border-t border-slate-100 bg-slate-50/50 px-5 py-4">

              <button
                type="button"
                onClick={() =>
                  setViewBatch(null)
                }
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-black text-slate-600 transition hover:bg-slate-100"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default FranchiseSchedule;