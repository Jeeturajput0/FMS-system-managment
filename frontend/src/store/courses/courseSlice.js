import { makeResourceSlice } from "../resource"; import * as thunks from "./courseThunks";
const slice = makeResourceSlice("courses", { fetch: thunks.fetchCourses, get: thunks.fetchCourseById, create: thunks.createCourse, update: thunks.updateCourse, remove: thunks.deleteCourse });
export const { clearError, clearSuccess, setItems } = slice.actions;
export default slice.reducer;
