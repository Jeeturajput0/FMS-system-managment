import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';
const DataContext = createContext();

const normalizeStudent = (student) => {
  const course = student.courseId && typeof student.courseId === 'object' ? student.courseId : null;
  const coaching = student.coachingId && typeof student.coachingId === 'object' ? student.coachingId : null;
  const total = Number(student.registrationFee || 0) + Number(student.courseFee || 0) + Number(student.certificateFee || 0);
  return {
    ...student,
    id: student.studentId || student._id,
    course: course?.title || student.course || '',
    franchise: coaching?.name || student.franchise || '',
    feesTotal: `₹${total.toLocaleString('en-IN')}`,
    feesPaid: `₹${Number(student.totalPaid || 0).toLocaleString('en-IN')}`,
    feesPending: `₹${Number(student.totalPending || 0).toLocaleString('en-IN')}`,
    feesStatus: Number(student.totalPending || 0) === 0 ? 'Paid' : Number(student.totalPaid || 0) > 0 ? 'Partial' : 'Pending',
    email: student.email || '',
    avatar: student.photo || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200`,
    attendance: `${student.attendancePercentage ?? 0}%`,
    status: student.status ? student.status[0].toUpperCase() + student.status.slice(1) : 'Registered',
  };
};

export const DataProvider = ({ children }) => {
  const [franchises, setFranchises] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [fees, setFees] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [admins, setAdmins] = useState([]);
  const enrollmentChartData = [];
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const loadBackendData = async () => {
      try {
        const [courseResponse, studentResponse, feeResponse] = await Promise.all([
          apiFetch('/api/courses'),
          apiFetch('/api/students?limit=1000'),
          apiFetch('/api/fees'),
        ]);
        setCourses((courseResponse.data || []).map((course) => ({
          ...course,
          id: course._id || course.id,
          feePriceNum: Number(course.courseFee || 0),
          feePrice: `₹${Number(course.courseFee || 0).toLocaleString('en-IN')}`,
          status: course.isPublished ? 'Published' : 'Draft',
        })));
        setStudents((studentResponse.data || []).map(normalizeStudent));
        setFees(feeResponse.data || []);
        setPayments(feeResponse.payments || []);
      } catch (error) {
        console.warn('Student and fee API unavailable, using local data.', error.message);
      }
    };

    loadBackendData();
  }, []);

  // Toast notification trigger
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Franchise Actions
  const addFranchise = (franchise) => {
    const newFranchise = {
      id: `FR-${Math.floor(100 + Math.random() * 900)}`,
      studentsCount: 0,
      activeBatches: 1,
      revenue: "₹0",
      revenueNum: 0,
      status: "Active",
      rating: 5.0,
      teachersCount: 2,
      established: new Date().toISOString().split('T')[0],
      ...franchise
    };
    setFranchises((prev) => [newFranchise, ...prev]);
    showToast(`Franchise "${newFranchise.name}" added successfully!`);
  };

  // Course Actions
  const addCourse = (course) => {
    const newCourse = {
      id: `CRS-${Math.floor(200 + Math.random() * 900)}`,
      enrolledStudents: 0,
      rating: 4.8,
      modulesCount: 0,
      modules: [],
      status: "Published",
      ...course
    };
    setCourses((prev) => [newCourse, ...prev]);
    showToast(`Course "${newCourse.title}" created successfully!`);
  };

  const replaceCourses = (nextCourses) => {
    setCourses(nextCourses);
  };

  // Student Actions
  const addStudent = async (student) => {
    const user = JSON.parse(localStorage.getItem('ai_scholars_user') || 'null');
    const course = courses.find((item) => item.id === student.courseId || item.title === student.course);
    const coachingId = student.coachingId || import.meta.env.VITE_COACHING_ID || user?.coachingId;
    const response = await apiFetch('/api/students', {
      method: 'POST',
      body: JSON.stringify({
        coachingId,
        name: student.name,
        email: student.email,
        mobile: student.mobile || student.phone,
        courseId: student.courseId || course?._id || course?.id,
        joiningDate: new Date().toISOString(),
        registrationFee: student.registrationFee,
        courseFee: student.courseFee ?? course?.feePriceNum,
        certificateFee: student.certificateFee,
      }),
    });
    const newStudent = normalizeStudent(response.student);
    setStudents((prev) => [newStudent, ...prev]);
    try {
      const feeResponse = await apiFetch(`/api/fees?studentId=${response.student._id}`);
      const newFee = feeResponse.data?.[0];
      setFees((prev) => newFee ? [newFee, ...prev.filter((fee) => fee.studentId?._id !== response.student._id)] : prev);
    } catch (error) {
      console.warn('Fee refresh failed after successful enrollment.', error.message);
    }
    showToast(`Student "${newStudent.name}" enrolled successfully!`);
    return newStudent;
  };

  // Admin Actions
  const addAdmin = (admin) => {
    const newAdmin = {
      id: `ADM-${Math.floor(10 + Math.random() * 90)}`,
      lastActive: "Just now",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      ...admin
    };
    setAdmins((prev) => [newAdmin, ...prev]);
    showToast(`Admin "${newAdmin.name}" added as ${newAdmin.role}!`);
  };

  // Issue Certificate Action
  const issueCertificate = (studentId, courseTitle) => {
    const student = students.find(s => s.id === studentId || s.name === studentId);
    const certId = `CRT-AIS-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newCert = {
      certificateId: certId,
      studentName: student ? student.name : studentId,
      studentId: student ? student.id : "STD-NEW",
      course: courseTitle || (student ? student.course : "AI Certification Track"),
      franchise: student ? student.franchise : "AI Scholar Delhi NCR",
      issueDate: new Date().toISOString().split('T')[0],
      completionDate: new Date().toISOString().split('T')[0],
      attendance: "95%",
      finalResult: "Grade A+ (95%)",
      certificateFee: "₹1,500",
      status: "Issued"
    };
    setCertificates((prev) => [newCert, ...prev]);
    showToast(`Certificate ${certId} issued successfully!`);
    return newCert;
  };

  // Notification Actions
  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast("All notifications marked as read");
  };

  return (
    <DataContext.Provider
      value={{
        franchises,
        courses,
        students,
        payments,
        fees,
        certificates,
        notifications,
        admins,
        enrollmentChartData,
        toasts,
        showToast,
        removeToast,
        addFranchise,
        addCourse,
        replaceCourses,
        addStudent,
        addAdmin,
        issueCertificate,
        markNotificationRead,
        markAllNotificationsRead
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
