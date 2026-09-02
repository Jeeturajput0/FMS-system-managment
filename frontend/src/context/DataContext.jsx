import React, { createContext, useContext, useState } from 'react';
const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [franchises, setFranchises] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [admins, setAdmins] = useState([]);
  const enrollmentChartData = [];
  const [toasts, setToasts] = useState([]);

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
  const addStudent = (student) => {
    const newStudent = {
      id: `STD-${Math.floor(5000 + Math.random() * 9000)}`,
      enrollmentDate: new Date().toISOString().split('T')[0],
      feesPending: student.feesPending || "₹0",
      feesStatus: student.feesPaid === student.feesTotal ? "Paid" : "Partial",
      attendance: "100%",
      status: "Active",
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random()*1000)}?auto=format&fit=crop&q=80&w=200`,
      ...student
    };
    setStudents((prev) => [newStudent, ...prev]);
    showToast(`Student "${newStudent.name}" enrolled successfully!`);
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
