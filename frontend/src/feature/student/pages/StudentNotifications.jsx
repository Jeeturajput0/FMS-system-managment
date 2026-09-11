import React from "react";
import {
  Bell,
  ClipboardList,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Sparkles,
} from "lucide-react";

const notifications = [
  {
    id: 1,
    title: "New Assignment Available",
    text: "React Todo Application is ready to submit.",
    type: "assignment",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 2,
    title: "Fee Reminder",
    text: "Your pending fee balance is ₹12,000.",
    type: "fee",
    time: "Yesterday",
    unread: true,
  },
  {
    id: 3,
    title: "Course Progress Updated",
    text: "Your React course progress has been updated.",
    type: "success",
    time: "2 days ago",
    unread: false,
  },
];

const getNotificationStyle = (type) => {
  switch (type) {
    case "assignment":
      return {
        icon: ClipboardList,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
        badge: "bg-blue-50 text-blue-700",
      };

    case "fee":
      return {
        icon: CreditCard,
        iconBg: "bg-red-50",
        iconColor: "text-red-500",
        badge: "bg-red-50 text-red-600",
      };

    case "success":
      return {
        icon: CheckCircle2,
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-600",
        badge: "bg-emerald-50 text-emerald-700",
      };

    default:
      return {
        icon: Bell,
        iconBg: "bg-orange-50",
        iconColor: "text-orange-500",
        badge: "bg-orange-50 text-orange-700",
      };
  }
};

const StudentNotifications = () => {
  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6">
      {/* ================= HEADER ================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-orange-500 to-amber-500 p-6 text-white shadow-lg shadow-orange-100 sm:p-8">
        {/* Decorative circles */}
        <div className="absolute -right-10 -top-16 h-44 w-44 rounded-full bg-white/10" />
        <div className="absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-white/10" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Bell className="h-7 w-7" />

              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-orange-500 bg-white px-1 text-[10px] font-black text-orange-600">
                  {unreadCount}
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black sm:text-3xl">
                  Notifications
                </h1>

                <Sparkles className="hidden h-5 w-5 sm:block" />
              </div>

              <p className="mt-1 text-sm font-medium text-orange-50">
                Stay updated with your learning activity.
              </p>
            </div>
          </div>

          <div className="self-start rounded-full bg-white/15 px-4 py-2 text-xs font-bold backdrop-blur-sm sm:self-auto">
            {unreadCount} Unread
          </div>
        </div>
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Total Notifications
              </p>

              <p className="mt-2 text-2xl font-black text-slate-900">
                {notifications.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50">
              <Bell className="h-5 w-5 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Unread
              </p>

              <p className="mt-2 text-2xl font-black text-slate-900">
                {unreadCount}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
              <Clock3 className="h-5 w-5 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* ================= NOTIFICATIONS ================= */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {/* List Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Recent Notifications
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Your latest learning updates
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
            {notifications.length} Updates
          </span>
        </div>

        {/* Notification List */}
        <div className="divide-y divide-slate-100">
          {notifications.map((notification) => {
            const style = getNotificationStyle(notification.type);
            const Icon = style.icon;

            return (
              <div
                key={notification.id}
                className={`group relative flex gap-4 p-5 transition hover:bg-slate-50 sm:p-6 ${
                  notification.unread
                    ? "bg-orange-50/20"
                    : "bg-white"
                }`}
              >
                {/* Unread Indicator */}
                {notification.unread && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-orange-500" />
                )}

                {/* Icon */}
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${style.iconBg}`}
                >
                  <Icon
                    className={`h-5 w-5 ${style.iconColor}`}
                  />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-black text-slate-900">
                          {notification.title}
                        </h3>

                        {notification.unread && (
                          <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-orange-600">
                            New
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {notification.text}
                      </p>
                    </div>

                    <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-slate-400">
                      <Clock3 size={13} />
                      {notification.time}
                    </span>
                  </div>

                  {/* Bottom */}
                  <div className="mt-4 flex items-center justify-between">
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wide ${style.badge}`}
                    >
                      {notification.type}
                    </span>

                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 transition group-hover:text-orange-500"
                    >
                      View
                      <ChevronRight
                        size={15}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <Bell className="h-7 w-7 text-slate-400" />
            </div>

            <h3 className="mt-4 font-black text-slate-800">
              No Notifications
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              You're all caught up!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default StudentNotifications;