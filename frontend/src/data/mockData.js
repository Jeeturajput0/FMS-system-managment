export const initialFranchises = [
  {
    id: "FR-101",
    name: "AI Scholar Agra",
    code: "AIS-AGR",
    owner: "Dr. Rajesh Sharma",
    email: "agra@aischolar.com",
    phone: "+91 98765 43210",
    location: "Agra, Uttar Pradesh",
    address: "14/2, Sanjay Place, Civil Lines, Agra, UP - 282002",
    studentsCount: 342,
    activeBatches: 12,
    revenue: "₹18,45,000",
    revenueNum: 1845000,
    status: "Active",
    established: "2022-03-15",
    rating: 4.9,
    teachersCount: 8,
    coursesOffered: ["Full Stack Web & AI Development", "Python for Artificial Intelligence & ML", "Data Analytics & Business Intelligence"]
  },
  {
    id: "FR-102",
    name: "AI Scholar Delhi NCR",
    code: "AIS-DEL",
    owner: "Meenakshi Verma",
    email: "delhi@aischolar.com",
    phone: "+91 98111 22334",
    location: "Connaught Place, New Delhi",
    address: "Plot 88, Barakhamba Road, Connaught Place, New Delhi - 110001",
    studentsCount: 680,
    activeBatches: 22,
    revenue: "₹42,80,000",
    revenueNum: 4280000,
    status: "Active",
    established: "2021-08-10",
    rating: 4.8,
    teachersCount: 16,
    coursesOffered: ["Full Stack Web & AI Development", "Python for Artificial Intelligence & ML", "Data Analytics & Business Intelligence", "Cybersecurity & Ethical Hacking", "MERN Stack Development"]
  },
  {
    id: "FR-103",
    name: "AI Scholar Jaipur",
    code: "AIS-JPR",
    owner: "Vikramaditya Singh",
    email: "jaipur@aischolar.com",
    phone: "+91 94140 99887",
    location: "Malviya Nagar, Jaipur",
    address: "C-45, Apex Tower, Malviya Nagar, Jaipur, Rajasthan - 302017",
    studentsCount: 215,
    activeBatches: 8,
    revenue: "₹12,60,000",
    revenueNum: 1260000,
    status: "Active",
    established: "2023-01-20",
    rating: 4.7,
    teachersCount: 6,
    coursesOffered: ["Python for Artificial Intelligence & ML", "MERN Stack Development"]
  },
  {
    id: "FR-104",
    name: "AI Scholar Lucknow",
    code: "AIS-LKO",
    owner: "Sunita Tripathi",
    email: "lucknow@aischolar.com",
    phone: "+91 97920 11223",
    location: "Gomti Nagar, Lucknow",
    address: "B-2/18, Vibhuti Khand, Gomti Nagar, Lucknow, UP - 226010",
    studentsCount: 190,
    activeBatches: 7,
    revenue: "₹9,85,000",
    revenueNum: 985000,
    status: "Pending Setup",
    established: "2023-11-05",
    rating: 4.5,
    teachersCount: 5,
    coursesOffered: ["Full Stack Web & AI Development", "Data Analytics & Business Intelligence"]
  }
];

export const initialCourses = [
  {
    id: "CRS-201",
    title: "Full Stack Web & AI Development",
    category: "AI & Software Engineering",
    duration: "6 Months (24 Weeks)",
    durationWeeks: 24,
    enrolledStudents: 420,
    feePrice: "₹35,000",
    feePriceNum: 35000,
    status: "Published",
    level: "Intermediate to Advanced",
    rating: 4.9,
    description: "Master modern full-stack web development integrated with LLM APIs, OpenAI, LangChain, React, Node.js, and Vector Databases.",
    modulesCount: 6,
    modules: [
      {
        id: "MOD-1",
        title: "Module 1: Frontend Mastery with React 19 & Tailwind CSS",
        topics: [
          { id: "TOP-1", title: "React Component Architecture & Hooks", type: "Video", duration: "45 mins", isCompleted: true },
          { id: "TOP-2", title: "Tailwind v4 Styling & Theme Customization", type: "PDF", duration: "15 pages", isCompleted: true },
          { id: "TOP-3", title: "Interactive UI State & Context API", type: "Assignment", duration: "2 Hours", isCompleted: false }
        ]
      },
      {
        id: "MOD-2",
        title: "Module 2: Backend Development with Node.js & Express",
        topics: [
          { id: "TOP-4", title: "RESTful API Architecture & Middleware", type: "Video", duration: "60 mins", isCompleted: true },
          { id: "TOP-5", title: "MongoDB Atlas & Mongoose Schemas", type: "PDF", duration: "22 pages", isCompleted: false },
          { id: "TOP-6", title: "Backend API Auth & JWT Security", type: "Test", duration: "45 mins", isCompleted: false }
        ]
      },
      {
        id: "MOD-3",
        title: "Module 3: AI Integration & OpenAI / LangChain APIs",
        topics: [
          { id: "TOP-7", title: "Connecting Open AI API & Prompt Engineering", type: "Video", duration: "90 mins", isCompleted: false },
          { id: "TOP-8", title: "Building AI Agents with LangChain & RAG", type: "Assignment", duration: "3 Hours", isCompleted: false }
        ]
      }
    ]
  },
  {
    id: "CRS-202",
    title: "Python for Artificial Intelligence & ML",
    category: "Artificial Intelligence",
    duration: "4 Months (16 Weeks)",
    durationWeeks: 16,
    enrolledStudents: 385,
    feePrice: "₹28,000",
    feePriceNum: 28000,
    status: "Published",
    level: "Beginner to Intermediate",
    rating: 4.8,
    description: "Comprehensive hands-on training in Python programming, NumPy, Pandas, Scikit-Learn, PyTorch, and Deep Learning models.",
    modulesCount: 5,
    modules: [
      {
        id: "MOD-201",
        title: "Module 1: Python Core & Data Structures",
        topics: [
          { id: "TOP-201", title: "Object Oriented Programming in Python", type: "Video", duration: "50 mins" },
          { id: "TOP-202", title: "NumPy & Pandas Data Manipulation Guide", type: "PDF", duration: "18 pages" }
        ]
      },
      {
        id: "MOD-202",
        title: "Module 2: Supervised & Unsupervised Machine Learning",
        topics: [
          { id: "TOP-203", title: "Regression, Classification & Model Tuning", type: "Assignment", duration: "2.5 Hours" }
        ]
      }
    ]
  },
  {
    id: "CRS-203",
    title: "Data Analytics & Business Intelligence",
    category: "Data Science",
    duration: "3 Months (12 Weeks)",
    durationWeeks: 12,
    enrolledStudents: 290,
    feePrice: "₹22,000",
    feePriceNum: 22000,
    status: "Published",
    level: "Beginner",
    rating: 4.7,
    description: "Learn Advanced Excel, SQL Queries, Power BI Dashboards, and Statistical Data Analysis for business decision making.",
    modulesCount: 4,
    modules: []
  },
  {
    id: "CRS-204",
    title: "Cybersecurity & Ethical Hacking",
    category: "Cybersecurity",
    duration: "6 Months (24 Weeks)",
    durationWeeks: 24,
    enrolledStudents: 175,
    feePrice: "₹32,000",
    feePriceNum: 32000,
    status: "Draft",
    level: "Advanced",
    rating: 4.6,
    description: "Hands-on network security, penetration testing, ethical hacking, vulnerability assessment, and SOC operations.",
    modulesCount: 5,
    modules: []
  },
  {
    id: "CRS-205",
    title: "MERN Stack Development",
    category: "Web Development",
    duration: "4 Months (16 Weeks)",
    durationWeeks: 16,
    enrolledStudents: 157,
    feePrice: "₹25,000",
    feePriceNum: 25000,
    status: "Archived",
    level: "Intermediate",
    rating: 4.5,
    description: "MongoDB, Express.js, React.js, and Node.js complete fullstack web development course.",
    modulesCount: 4,
    modules: []
  }
];

export const initialStudents = [
  {
    id: "STD-5001",
    name: "Arjun Mehta",
    email: "arjun.m@gmail.com",
    phone: "+91 98765 11223",
    course: "Full Stack Web & AI Development",
    courseId: "CRS-201",
    franchise: "AI Scholar Agra",
    franchiseId: "FR-101",
    batch: "Batch AI-2026A",
    enrollmentDate: "2026-01-10",
    feesTotal: "₹35,000",
    feesPaid: "₹35,000",
    feesPending: "₹0",
    feesStatus: "Paid",
    attendance: "94%",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    city: "Agra",
    gender: "Male"
  },
  {
    id: "STD-5002",
    name: "Priya Sharma",
    email: "priya.s@yahoo.com",
    phone: "+91 99102 33445",
    course: "Python for Artificial Intelligence & ML",
    courseId: "CRS-202",
    franchise: "AI Scholar Delhi NCR",
    franchiseId: "FR-102",
    batch: "Batch PY-2026B",
    enrollmentDate: "2026-01-15",
    feesTotal: "₹28,000",
    feesPaid: "₹14,000",
    feesPending: "₹14,000",
    feesStatus: "Partial",
    attendance: "88%",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    city: "New Delhi",
    gender: "Female"
  },
  {
    id: "STD-5003",
    name: "Rohan Kapoor",
    email: "rohan.kapoor@gmail.com",
    phone: "+91 97112 55667",
    course: "Data Analytics & Business Intelligence",
    courseId: "CRS-203",
    franchise: "AI Scholar Jaipur",
    franchiseId: "FR-103",
    batch: "Batch DA-2026A",
    enrollmentDate: "2026-02-01",
    feesTotal: "₹22,000",
    feesPaid: "₹22,000",
    feesPending: "₹0",
    feesStatus: "Paid",
    attendance: "96%",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    city: "Jaipur",
    gender: "Male"
  },
  {
    id: "STD-5004",
    name: "Ananya Gupta",
    email: "ananya.g@outlook.com",
    phone: "+91 98990 77889",
    course: "Full Stack Web & AI Development",
    courseId: "CRS-201",
    franchise: "AI Scholar Agra",
    franchiseId: "FR-101",
    batch: "Batch AI-2026A",
    enrollmentDate: "2026-02-05",
    feesTotal: "₹35,000",
    feesPaid: "₹17,500",
    feesPending: "₹17,500",
    feesStatus: "Partial",
    attendance: "91%",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
    city: "Agra",
    gender: "Female"
  },
  {
    id: "STD-5005",
    name: "Karan Patel",
    email: "karan.p@gmail.com",
    phone: "+91 96500 44332",
    course: "Cybersecurity & Ethical Hacking",
    courseId: "CRS-204",
    franchise: "AI Scholar Delhi NCR",
    franchiseId: "FR-102",
    batch: "Batch CS-2026A",
    enrollmentDate: "2026-02-12",
    feesTotal: "₹32,000",
    feesPaid: "₹0",
    feesPending: "₹32,000",
    feesStatus: "Pending",
    attendance: "75%",
    status: "Inactive",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    city: "Noida",
    gender: "Male"
  },
  {
    id: "STD-5006",
    name: "Sneha Rastogi",
    email: "sneha.r@gmail.com",
    phone: "+91 94150 88776",
    course: "MERN Stack Development",
    courseId: "CRS-205",
    franchise: "AI Scholar Lucknow",
    franchiseId: "FR-104",
    batch: "Batch MERN-2025C",
    enrollmentDate: "2025-11-01",
    feesTotal: "₹25,000",
    feesPaid: "₹25,000",
    feesPending: "₹0",
    feesStatus: "Paid",
    attendance: "98%",
    status: "Completed",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    city: "Lucknow",
    gender: "Female"
  }
];

export const initialPayments = [
  {
    receiptNo: "REC-9081",
    studentName: "Arjun Mehta",
    studentId: "STD-5001",
    franchise: "AI Scholar Agra",
    feeType: "Course Fee (Full)",
    amount: "₹35,000",
    amountNum: 35000,
    paymentMethod: "UPI (Google Pay)",
    date: "2026-01-10",
    status: "Completed"
  },
  {
    receiptNo: "REC-9082",
    studentName: "Priya Sharma",
    studentId: "STD-5002",
    franchise: "AI Scholar Delhi NCR",
    feeType: "1st Installment",
    amount: "₹14,000",
    amountNum: 14000,
    paymentMethod: "Credit Card",
    date: "2026-01-15",
    status: "Completed"
  },
  {
    receiptNo: "REC-9083",
    studentName: "Rohan Kapoor",
    studentId: "STD-5003",
    franchise: "AI Scholar Jaipur",
    feeType: "Registration Fee",
    amount: "₹2,500",
    amountNum: 2500,
    paymentMethod: "Net Banking",
    date: "2026-02-01",
    status: "Completed"
  },
  {
    receiptNo: "REC-9084",
    studentName: "Ananya Gupta",
    studentId: "STD-5004",
    franchise: "AI Scholar Agra",
    feeType: "1st Installment",
    amount: "₹17,500",
    amountNum: 17500,
    paymentMethod: "UPI (PhonePe)",
    date: "2026-02-05",
    status: "Completed"
  },
  {
    receiptNo: "REC-9085",
    studentName: "Sneha Rastogi",
    studentId: "STD-5006",
    franchise: "AI Scholar Lucknow",
    feeType: "Certificate Fee",
    amount: "₹1,500",
    amountNum: 1500,
    paymentMethod: "Debit Card",
    date: "2026-02-28",
    status: "Completed"
  },
  {
    receiptNo: "REC-9086",
    studentName: "Karan Patel",
    studentId: "STD-5005",
    franchise: "AI Scholar Delhi NCR",
    feeType: "Course Fee",
    amount: "₹32,000",
    amountNum: 32000,
    paymentMethod: "Bank Transfer",
    date: "2026-03-01",
    status: "Pending"
  }
];

export const initialCertificates = [
  {
    certificateId: "CRT-AIS-2026-001",
    studentName: "Sneha Rastogi",
    studentId: "STD-5006",
    course: "MERN Stack Development",
    franchise: "AI Scholar Lucknow",
    issueDate: "2026-02-28",
    completionDate: "2026-02-20",
    attendance: "98%",
    finalResult: "Grade A+ (94%)",
    certificateFee: "₹1,500",
    status: "Issued"
  },
  {
    certificateId: "CRT-AIS-2026-002",
    studentName: "Arjun Mehta",
    studentId: "STD-5001",
    course: "Full Stack Web & AI Development",
    franchise: "AI Scholar Agra",
    issueDate: "2026-03-01",
    completionDate: "2026-02-25",
    attendance: "94%",
    finalResult: "Grade A (89%)",
    certificateFee: "₹1,500",
    status: "Issued"
  },
  {
    certificateId: "CRT-AIS-2026-003",
    studentName: "Rohan Kapoor",
    studentId: "STD-5003",
    course: "Data Analytics & Business Intelligence",
    franchise: "AI Scholar Jaipur",
    issueDate: "Pending Review",
    completionDate: "2026-03-01",
    attendance: "96%",
    finalResult: "Grade A+ (92%)",
    certificateFee: "₹1,500",
    status: "Pending"
  }
];

export const initialNotifications = [
  {
    id: "NOTIF-1",
    title: "New Student Enrollment",
    description: "Ananya Gupta registered for Full Stack Web & AI Development at AI Scholar Agra.",
    category: "Students",
    time: "10 mins ago",
    timestamp: "2026-09-01T23:00:00",
    read: false
  },
  {
    id: "NOTIF-2",
    title: "Fee Payment Received",
    description: "Received ₹17,500 payment from Ananya Gupta via UPI.",
    category: "Payments",
    time: "25 mins ago",
    timestamp: "2026-09-01T22:45:00",
    read: false
  },
  {
    id: "NOTIF-3",
    title: "Franchise Royalty Report Generated",
    description: "AI Scholar Delhi NCR monthly performance report is ready for download.",
    category: "Franchises",
    time: "2 hours ago",
    timestamp: "2026-09-01T21:00:00",
    read: true
  },
  {
    id: "NOTIF-4",
    title: "Course Catalog Updated",
    description: "New AI LangChain & RAG module added to Full Stack Web & AI Development course.",
    category: "Courses",
    time: "5 hours ago",
    timestamp: "2026-09-01T18:00:00",
    read: true
  },
  {
    id: "NOTIF-5",
    title: "System Update Completed",
    description: "AI Scholar LMS Engine upgraded to v3.4.0 with automated certificate verification.",
    category: "System",
    time: "1 day ago",
    timestamp: "2026-08-31T10:00:00",
    read: true
  }
];

export const initialAdmins = [
  {
    id: "ADM-01",
    name: "Arjun Sharma",
    email: "admin@aischolar.com",
    role: "Super Admin",
    assignedFranchise: "All Franchises (HQ)",
    lastActive: "Just now",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "ADM-02",
    name: "Vikram Sethi",
    email: "vikram@aischolar.com",
    role: "AI Scholar Admin",
    assignedFranchise: "AI Scholar Delhi NCR",
    lastActive: "15 mins ago",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "ADM-03",
    name: "Pooja Malhotra",
    email: "pooja@aischolar.com",
    role: "Franchise Admin",
    assignedFranchise: "AI Scholar Agra",
    lastActive: "2 hours ago",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "ADM-04",
    name: "Rajiv Nambiar",
    email: "rajiv@aischolar.com",
    role: "Accountant",
    assignedFranchise: "All Franchises (HQ)",
    lastActive: "Yesterday",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "ADM-05",
    name: "Divya Singhania",
    email: "divya@aischolar.com",
    role: "Content Manager",
    assignedFranchise: "HQ Curriculum Team",
    lastActive: "3 days ago",
    status: "Inactive",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200"
  }
];

export const enrollmentChartData = [
  { month: "Jan", students: 120, revenue: 1450000, franchises: 3 },
  { month: "Feb", students: 185, revenue: 2100000, franchises: 3 },
  { month: "Mar", students: 240, revenue: 3200000, franchises: 4 },
  { month: "Apr", students: 310, revenue: 4100000, franchises: 4 },
  { month: "May", students: 450, revenue: 5600000, franchises: 4 },
  { month: "Jun", students: 580, revenue: 6900000, franchises: 4 },
  { month: "Jul", students: 720, revenue: 8300000, franchises: 4 },
  { month: "Aug", students: 950, revenue: 10400000, franchises: 4 }
];
