export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentStudent = (state) => state.studentPortal.dashboard?.student || state.auth.user;
export const selectStudentCourse = (state) => selectCurrentStudent(state)?.courseId || state.studentPortal.dashboard?.course || null;
export const selectPendingFees = (state) => state.studentPortal.fees.filter((fee) => Number(fee.totalPending ?? fee.pendingAmount ?? 0) > 0);
export const selectCertificateStatus = (state) => state.studentPortal.certificate?.status || "Not issued";
export const selectPublishedCourses = (state) => state.courses.items.filter((course) => course.isPublished);
