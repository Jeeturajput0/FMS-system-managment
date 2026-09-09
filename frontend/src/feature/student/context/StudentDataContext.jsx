import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../../utils/api";

const StudentDataContext = createContext(null);

export const StudentDataProvider = ({ children }) => {
  const [data, setData] = useState({
    dashboard: null,
    certificate: null,
    courses: [],
    fees: [],
    user: null,
    loading: true,
    error: "",
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [dashboardResponse, coursesResponse, feesResponse, userResponse, certificateResponse] =
          await Promise.all([
            apiFetch("/api/portal/dashboard"),
            apiFetch("/api/portal/courses"),
            apiFetch("/api/portal/fees"),
            apiFetch("/api/auth/me"),
            apiFetch("/api/certificates/me"),
          ]);

        if (!cancelled) {
          setData({
            dashboard: dashboardResponse.data || null,
            certificate: certificateResponse.data || null,
            courses: coursesResponse.data || [],
            fees: feesResponse.data || [],
            user: userResponse.user || null,
            loading: false,
            error: "",
          });
        }
      } catch (error) {
        if (!cancelled) {
          setData((current) => ({
            ...current,
            loading: false,
            error: error.message || "Unable to load student data",
          }));
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => data, [data]);
  return <StudentDataContext.Provider value={value}>{children}</StudentDataContext.Provider>;
};

export const useStudentData = () => {
  const context = useContext(StudentDataContext);
  if (!context) throw new Error("useStudentData must be used within StudentDataProvider");
  return context;
};
