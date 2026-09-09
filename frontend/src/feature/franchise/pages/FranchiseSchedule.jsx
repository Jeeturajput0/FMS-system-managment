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
} from "lucide-react";
import { apiFetch } from "../../../utils/api";

const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
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

  // =====================================================
  // FETCH SCHEDULE
  // =====================================================

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiFetch(
        "/api/batches/franchise/batches?limit=100",
      );

      setBatches(response?.batches || []);
    } catch (requestError) {
      console.error("Error loading schedule:", requestError);

      setError(requestError?.message || "Unable to load schedule");
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

    if (!query) return batches;

    return batches.filter((batch) => {
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
          .includes(query),
      );
    });
  }, [batches, search]);

  // =====================================================
  // TOTAL SCHEDULED DAYS
  // =====================================================

  const totalScheduledDays = useMemo(() => {
    return batches.reduce(
      (total, batch) => total + (batch?.days?.length || 0),
      0,
    );
  }, [batches]);

  // =====================================================
  // UNIQUE TEACHERS
  // =====================================================

  const totalTeachers = useMemo(() => {
    const teachers = batches
      .map(
        (batch) => batch?.teacher?._id || batch?.teacher || batch?.teacherName,
      )
      .filter(Boolean);

    return new Set(teachers.map(String)).size;
  }, [batches]);

  // =====================================================
  // ACTIVE BATCHES
  // =====================================================

  const activeBatches = useMemo(() => {
    return batches.filter((batch) => batch?.status === "ACTIVE").length;
  }, [batches]);

  // =====================================================
  // DAY BATCHES
  // =====================================================

  const getBatchesForDay = (day) => {
    return filteredBatches.filter((batch) => batch?.days?.includes(day));
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    return (
      STATUS_STYLES[status] || "bg-slate-50 text-slate-600 border-slate-100"
    );
  };

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
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-3 py-2.5">
          <p className="text-xs font-semibold text-red-700">{error}</p>

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
          COMPACT STATS
      ================================================= */}

      {!loading && (
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
          {/* Batches */}
          <div className="group rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
                <BookOpen size={16} />
              </div>

              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Batches
                </p>

                <p className="mt-0.5 text-lg font-black leading-tight text-slate-900">
                  {batches.length}
                </p>
              </div>
            </div>
          </div>

          {/* Scheduled Days */}
          <div className="group rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-600">
                <CalendarDays size={16} />
              </div>

              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Scheduled
                </p>

                <p className="mt-0.5 text-lg font-black leading-tight text-indigo-600">
                  {totalScheduledDays}
                </p>
              </div>
            </div>
          </div>

          {/* Teachers */}
          <div className="group rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-purple-50 text-purple-600">
                <UserRound size={16} />
              </div>

              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Teachers
                </p>

                <p className="mt-0.5 text-lg font-black leading-tight text-purple-600">
                  {totalTeachers}
                </p>
              </div>
            </div>
          </div>

          {/* Active */}
          <div className="group rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-50">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />
              </div>

              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Active
                </p>

                <p className="mt-0.5 text-lg font-black leading-tight text-emerald-600">
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
            <div className="relative w-full sm:max-w-sm">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search batch, course, teacher..."
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
                {filteredBatches.length}
              </span>{" "}
              batches
            </p>
          </div>
        </div>
      )}

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <Loader2 size={26} className="mx-auto animate-spin text-blue-600" />

          <p className="mt-2 text-xs font-semibold text-slate-500">
            Loading schedule...
          </p>
        </div>
      )}

      {/* =================================================
          EMPTY
      ================================================= */}

      {!loading && !error && batches.length === 0 && (
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
          WEEKLY SCHEDULE
      ================================================= */}

      {!loading && !error && filteredBatches.length > 0 && (
        <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
          {DAYS.map((day) => {
            const dayBatches = getBatchesForDay(day);

            return (
              <div
                key={day}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-blue-100 hover:shadow-md"
              >
                {/* Day Header */}
                <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-3.5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`grid h-8 w-8 place-items-center rounded-lg border text-[10px] font-black ${DAY_COLORS[day]}`}
                    >
                      {DAY_SHORT[day]}
                    </div>

                    <div>
                      <h2 className="text-sm font-black text-slate-900">
                        {day}
                      </h2>

                      <p className="text-[10px] font-medium text-slate-400">
                        {dayBatches.length}{" "}
                        {dayBatches.length === 1 ? "class" : "classes"}
                      </p>
                    </div>
                  </div>

                  <CalendarDays size={15} className="text-slate-300" />
                </div>

                {/* Day Content */}
                <div className="space-y-2.5 p-3">
                  {dayBatches.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/70 p-5 text-center">
                      <CalendarDays
                        size={18}
                        className="mx-auto text-slate-300"
                      />

                      <p className="mt-1.5 text-[10px] font-medium text-slate-400">
                        No classes scheduled
                      </p>
                    </div>
                  ) : (
                    dayBatches.map((batch) => {
                      const batchName =
                        batch?.name || batch?.batchName || "Unnamed Batch";

                      const courseName =
                        batch?.course?.title ||
                        batch?.course?.name ||
                        batch?.courseName ||
                        "Course not assigned";

                      const teacherName =
                        batch?.teacher?.name ||
                        batch?.teacherName ||
                        "Teacher not assigned";

                      const studentCount =
                        batch?.studentCount ?? batch?.students?.length ?? 0;

                      const time =
                        batch?.startTime && batch?.endTime
                          ? `${batch.startTime} - ${batch.endTime}`
                          : "Time not set";

                      const status = batch?.status || "ACTIVE";

                      return (
                        <div
                          key={`${day}-${batch._id}`}
                          className="group rounded-lg border border-slate-200 bg-white p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-sm"
                        >
                          {/* Top */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-[10px] font-black text-white shadow-sm">
                                  {batchName.charAt(0).toUpperCase()}
                                </div>

                                <h3 className="truncate text-sm font-bold text-slate-900">
                                  {batchName}
                                </h3>
                              </div>

                              {batch?.code && (
                                <span className="ml-9 mt-1 inline-flex rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-500">
                                  {batch.code}
                                </span>
                              )}
                            </div>

                            <span
                              className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold ${getStatusStyle(
                                status,
                              )}`}
                            >
                              {status}
                            </span>
                          </div>

                          {/* Course */}
                          <div className="mt-2.5 flex items-center gap-2 text-xs">
                            <BookOpen
                              size={14}
                              className="shrink-0 text-purple-500"
                            />

                            <span className="truncate font-semibold text-slate-700">
                              {courseName}
                            </span>
                          </div>

                          {/* Time */}
                          <div className="mt-1.5 flex items-center gap-2 text-xs">
                            <Clock3
                              size={14}
                              className="shrink-0 text-blue-500"
                            />

                            <span className="font-semibold text-slate-700">
                              {time}
                            </span>
                          </div>

                          {/* Teacher */}
                          <div className="mt-1.5 flex items-center gap-2 text-xs">
                            <UserRound
                              size={14}
                              className="shrink-0 text-indigo-500"
                            />

                            <span className="truncate text-slate-500">
                              {teacherName}
                            </span>
                          </div>

                          {/* Bottom Info */}
                          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
                            <div className="flex min-w-0 items-center gap-1.5 truncate text-[11px] font-medium text-slate-400">
                              <DoorOpen size={13} className="shrink-0" />

                              <span className="truncate">
                                {batch?.room || "Room not assigned"}
                              </span>
                            </div>

                            <div className="flex shrink-0 items-center gap-1 rounded-md bg-slate-50 px-2 py-1 text-[11px] font-bold text-slate-600">
                              <Users size={12} className="text-slate-400" />

                              {studentCount}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =================================================
          SEARCH EMPTY
      ================================================= */}

      {!loading &&
        !error &&
        batches.length > 0 &&
        filteredBatches.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-slate-100">
              <Search size={21} className="text-slate-400" />
            </div>

            <h3 className="mt-3 text-sm font-bold text-slate-800">
              No schedule found
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Try another batch, course, teacher or room.
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
    </div>
  );
};

export default FranchiseSchedule;
