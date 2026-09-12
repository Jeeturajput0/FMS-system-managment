export const unwrapList = (response, key) => {
  const value = response?.[key] ?? response?.data?.[key] ?? response?.data ?? [];
  return Array.isArray(value) ? value : [];
};

export const unwrapItem = (response, key) =>
  response?.[key] ?? response?.data?.[key] ?? response?.data ?? response;

export const queryString = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") query.set(key, value);
  });
  const value = query.toString();
  return value ? `?${value}` : "";
};

export const normalizeCourse = (course = {}) => {
  const duration = course.duration && typeof course.duration === "object"
    ? `${course.duration.value || 1} ${course.duration.unit || "months"}`
    : course.duration || "1 month";
  const fee = Number(course.courseFee ?? course.feePriceNum ?? 0);
  return { ...course, id: course._id || course.id, duration, durationText: duration, feePriceNum: fee, feePrice: `₹${fee.toLocaleString("en-IN")}`, status: course.status || (course.isPublished === false ? "Draft" : "Published"), image: course.images?.[0] || course.thumbnail || course.image || "", enrolledStudents: Number(course.enrolledStudents || 0) };
};
