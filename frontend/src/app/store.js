import { configureStore } from "@reduxjs/toolkit";
import auth from "../store/auth/authSlice"; import dashboard from "../store/dashboard/dashboardSlice"; import courses from "../store/courses/courseSlice"; import students from "../store/students/studentSlice"; import franchises from "../store/franchises/franchiseSlice"; import fees from "../store/fees/feeSlice"; import studentPortal from "../store/studentPortal/studentPortalSlice";
export const store = configureStore({ reducer: { auth, dashboard, courses, students, franchises, fees, studentPortal }, devTools: import.meta.env.DEV });
