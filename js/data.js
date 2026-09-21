/**
 * MEDICARE+ - Central Data Repository
 * Mock Data for Doctors, Departments, Symptoms, and Initial Appointments
 */

window.MEDICARE_DATA = {
  departments: [
    { id: "all", name: "All Specialties" },
    { id: "cardiology", name: "Cardiology", icon: "❤️" },
    { id: "neurology", name: "Neurology", icon: "🧠" },
    { id: "pediatrics", name: "Pediatrics", icon: "👶" },
    { id: "dermatology", name: "Dermatology", icon: "🧴" },
    { id: "orthopedics", name: "Orthopedics", icon: "🦴" },
    { id: "general", name: "General Medicine", icon: "🩺" }
  ],

  doctors: [
    {
      id: "doc-1",
      name: "Dr. Sarah Jenkins",
      qualification: "MD, DM (Cardiology) - Harvard Med",
      department: "cardiology",
      departmentName: "Cardiology",
      experience: "14+ Years Exp.",
      hospital: "Apollo Heart Center, Bangalore",
      rating: 4.9,
      reviewsCount: 142,
      fee: 800,
      avatar: "👩‍⚕️",
      availableDays: ["Monday", "Wednesday", "Friday"],
      availableSlots: ["09:00 AM", "10:30 AM", "02:00 PM", "04:30 PM", "06:00 PM"],
      bio: "Specialist in non-invasive cardiology, preventive heart care, hypertension, and advanced lipidology."
    },
    {
      id: "doc-2",
      name: "Dr. Arvind Patel",
      qualification: "MBBS, MD (General Medicine)",
      department: "general",
      departmentName: "General Medicine",
      experience: "11+ Years Exp.",
      hospital: "Care Health City, Hyderabad",
      rating: 4.8,
      reviewsCount: 210,
      fee: 500,
      avatar: "👨‍⚕️",
      availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Saturday"],
      availableSlots: ["10:00 AM", "11:30 AM", "01:00 PM", "03:30 PM", "05:00 PM"],
      bio: "Expert in infectious diseases, chronic lifestyle management, seasonal fever diagnosis, and adult immunization."
    },
    {
      id: "doc-3",
      name: "Dr. Priya Sharma",
      qualification: "MD (Dermatology, Venereology & Leprosy)",
      department: "dermatology",
      departmentName: "Dermatology",
      experience: "9+ Years Exp.",
      hospital: "Skin & Aesthetic Clinic, Tirupati",
      rating: 4.9,
      reviewsCount: 188,
      fee: 650,
      avatar: "👩‍⚕️",
      availableDays: ["Tuesday", "Thursday", "Saturday"],
      availableSlots: ["11:00 AM", "12:30 PM", "03:00 PM", "04:30 PM", "06:30 PM"],
      bio: "Specialized in clinical cosmetology, eczema, acne management, allergies, and laser skin therapeutics."
    },
    {
      id: "doc-4",
      name: "Dr. Robert Vance",
      qualification: "M.Ch, MS (Orthopedics, Joint Replacement)",
      department: "orthopedics",
      departmentName: "Orthopedics",
      experience: "16+ Years Exp.",
      hospital: "Apex Bone & Joint Hospital, Chennai",
      rating: 4.7,
      reviewsCount: 95,
      fee: 900,
      avatar: "👨‍⚕️",
      availableDays: ["Monday", "Wednesday", "Friday", "Saturday"],
      availableSlots: ["09:30 AM", "11:00 AM", "02:30 PM", "05:00 PM"],
      bio: "Renowned orthopedic surgeon specializing in robotic knee arthroplasty, sports injury rehabilitation, and spine therapy."
    },
    {
      id: "doc-5",
      name: "Dr. Ananya Roy",
      qualification: "MD (Pediatrics), DNB (Neonatology)",
      department: "pediatrics",
      departmentName: "Pediatrics",
      experience: "8+ Years Exp.",
      hospital: "Rainbow Children's Medicare, Bangalore",
      rating: 4.95,
      reviewsCount: 310,
      fee: 600,
      avatar: "👩‍⚕️",
      availableDays: ["Monday", "Tuesday", "Wednesday", "Friday"],
      availableSlots: ["10:00 AM", "11:00 AM", "01:30 PM", "04:00 PM", "05:30 PM"],
      bio: "Compassionate pediatrician committed to newborn care, developmental assessment, pediatric nutrition, and child vaccination."
    },
    {
      id: "doc-6",
      name: "Dr. Vikram Malhotra",
      qualification: "MD, DM (Neurology) - AIIMS",
      department: "neurology",
      departmentName: "Neurology",
      experience: "18+ Years Exp.",
      hospital: "Institute of Neurosciences, Hyderabad",
      rating: 4.85,
      reviewsCount: 164,
      fee: 1000,
      avatar: "👨‍⚕️",
      availableDays: ["Tuesday", "Thursday", "Saturday"],
      availableSlots: ["10:00 AM", "12:00 PM", "03:00 PM", "05:00 PM", "06:30 PM"],
      bio: "Leading consultant neurologist focused on migraine, epilepsy management, stroke rehabilitation, and neuro-muscular disorders."
    }
  ],

  symptomsCatalog: [
    // Chest / Heart
    { id: "s-chest-pain", name: "Chest Pain / Tightness", category: "Chest & Heart", severityWeight: 5, dept: "cardiology" },
    { id: "s-palpitations", name: "Rapid or Irregular Heartbeat", category: "Chest & Heart", severityWeight: 4, dept: "cardiology" },
    { id: "s-short-breath", name: "Shortness of Breath", category: "Chest & Heart", severityWeight: 4, dept: "cardiology" },
    
    // Head & Neuro
    { id: "s-headache-severe", name: "Severe Persistent Headache", category: "Head & Neuro", severityWeight: 4, dept: "neurology" },
    { id: "s-dizziness", name: "Dizziness or Loss of Balance", category: "Head & Neuro", severityWeight: 3, dept: "neurology" },
    { id: "s-vision-blur", name: "Sudden Blurred Vision", category: "Head & Neuro", severityWeight: 4, dept: "neurology" },

    // Skin
    { id: "s-rash", name: "Skin Rash / Redness", category: "Skin", severityWeight: 2, dept: "dermatology" },
    { id: "s-itching", name: "Severe Itching or Hives", category: "Skin", severityWeight: 2, dept: "dermatology" },
    { id: "s-skin-lesion", name: "Unusual Moles or Skin Lesions", category: "Skin", severityWeight: 3, dept: "dermatology" },

    // Bones & Joints
    { id: "s-joint-pain", name: "Joint Stiffness or Pain", category: "Bones & Joints", severityWeight: 3, dept: "orthopedics" },
    { id: "s-back-pain", name: "Severe Lower Back Pain", category: "Bones & Joints", severityWeight: 3, dept: "orthopedics" },
    { id: "s-swollen-knee", name: "Swelling in Limbs or Joints", category: "Bones & Joints", severityWeight: 3, dept: "orthopedics" },

    // General
    { id: "s-fever-high", name: "High Fever (> 101°F)", category: "General", severityWeight: 3, dept: "general" },
    { id: "s-fatigue", name: "Extreme Fatigue & Weakness", category: "General", severityWeight: 2, dept: "general" },
    { id: "s-cough", name: "Persistent Cough / Sore Throat", category: "General", severityWeight: 2, dept: "general" },
    { id: "s-nausea", name: "Nausea, Vomiting or Stomach Pain", category: "General", severityWeight: 2, dept: "general" }
  ],

  // Seed sample appointment for initial viva demonstration
  initialAppointments: [
    {
      id: "APT-10821",
      patientName: "Rahul Varma",
      patientPhone: "+91 98765 43210",
      patientEmail: "rahul.v@example.com",
      doctorId: "doc-1",
      doctorName: "Dr. Sarah Jenkins",
      department: "Cardiology",
      date: "2026-09-25",
      time: "10:30 AM",
      reason: "Routine Cardiac Checkup & ECG Review",
      status: "Confirmed",
      fee: 800,
      createdAt: "2026-09-20T10:00:00"
    }
  ]
};

var MEDICARE_DATA = window.MEDICARE_DATA;

// Initialize LocalStorage with seed appointments if empty
if (!localStorage.getItem("medicare_appointments")) {
  localStorage.setItem("medicare_appointments", JSON.stringify(window.MEDICARE_DATA.initialAppointments));
}
