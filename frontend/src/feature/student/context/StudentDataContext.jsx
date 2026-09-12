import React, { createContext, useContext, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { fetchStudentPortal } from "../../../store/studentPortal/studentPortalThunks";
import { fetchCurrentUser } from "../../../store/auth/authThunks";
const StudentDataContext = createContext(null);
export const StudentDataProvider = ({ children }) => { const dispatch = useAppDispatch(); const portal = useAppSelector((state) => state.studentPortal); const user = useAppSelector((state) => state.auth.user); useEffect(() => { dispatch(fetchStudentPortal()); dispatch(fetchCurrentUser()); }, [dispatch]); const value = useMemo(() => ({ ...portal, user }), [portal, user]); return <StudentDataContext.Provider value={value}>{children}</StudentDataContext.Provider>; };
export const useStudentData = () => { const context = useContext(StudentDataContext); if (!context) throw new Error("useStudentData must be used within StudentDataProvider"); return context; };
