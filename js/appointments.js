/**
 * MEDICARE+ - Appointment Booking & Management Engine
 * Handles appointment creation, time-slot selection, localStorage persistence,
 * cancellation, and generation of printable hospital passes.
 */

let selectedSlotTime = null;

document.addEventListener("DOMContentLoaded", () => {
  initBookingForm();
  renderAppointmentsList();
  handleUrlParams();
  initSlipModal();
});

/* ==========================================================
   1. Initialize Booking Form & Dynamic Doctors Dropdown
   ========================================================== */
function initBookingForm() {
  const deptSelect = document.getElementById("bookingDepartment");
  const doctorSelect = document.getElementById("bookingDoctor");
  const dateInput = document.getElementById("bookingDate");
  const bookingForm = document.getElementById("appointmentBookingForm");

  // Prevent selecting dates in the past
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  const data = window.MEDICARE_DATA || (typeof MEDICARE_DATA !== "undefined" ? MEDICARE_DATA : null);

  // Populate Department Dropdown
  if (deptSelect && data) {
    deptSelect.innerHTML = '<option value="">-- Choose Medical Specialty --</option>';
    data.departments.forEach(dept => {
      if (dept.id !== "all") {
        deptSelect.innerHTML += `<option value="${dept.id}">${dept.name}</option>`;
      }
    });

    deptSelect.addEventListener("change", (e) => {
      populateDoctorsDropdown(e.target.value);
    });
  }

  // Doctor selection listener -> render available time slots
  if (doctorSelect) {
    doctorSelect.addEventListener("change", (e) => {
      renderDoctorTimeSlots(e.target.value);
    });
  }

  // Form submission handler
  if (bookingForm) {
    bookingForm.addEventListener("submit", handleBookingSubmit);
  }
}

function populateDoctorsDropdown(departmentId, preselectedDocId = null) {
  const doctorSelect = document.getElementById("bookingDoctor");
  const data = window.MEDICARE_DATA || (typeof MEDICARE_DATA !== "undefined" ? MEDICARE_DATA : null);
  if (!doctorSelect || !data) return;

  const filteredDocs = departmentId
    ? data.doctors.filter(d => d.department === departmentId)
    : data.doctors;

  doctorSelect.innerHTML = '<option value="">-- Select a Specialist Doctor --</option>';
  filteredDocs.forEach(doc => {
    const isSelected = preselectedDocId === doc.id ? "selected" : "";
    doctorSelect.innerHTML += `<option value="${doc.id}" ${isSelected}>${doc.name} (${doc.departmentName} - ₹${doc.fee})</option>`;
  });

  if (preselectedDocId) {
    renderDoctorTimeSlots(preselectedDocId);
  } else {
    clearTimeSlots();
  }
}

function renderDoctorTimeSlots(doctorId) {
  const slotsContainer = document.getElementById("timeSlotsContainer");
  const data = window.MEDICARE_DATA || (typeof MEDICARE_DATA !== "undefined" ? MEDICARE_DATA : null);
  if (!slotsContainer || !data) return;

  const doctor = data.doctors.find(d => d.id === doctorId);
  if (!doctor) {
    clearTimeSlots();
    return;
  }

  selectedSlotTime = null;
  slotsContainer.innerHTML = "";

  doctor.availableSlots.forEach(slot => {
    const slotBtn = document.createElement("button");
    slotBtn.type = "button";
    slotBtn.className = "slot-btn";
    slotBtn.textContent = slot;

    slotBtn.addEventListener("click", () => {
      document.querySelectorAll(".slot-btn").forEach(b => b.classList.remove("selected"));
      slotBtn.classList.add("selected");
      selectedSlotTime = slot;
    });

    slotsContainer.appendChild(slotBtn);
  });
}

function clearTimeSlots() {
  const slotsContainer = document.getElementById("timeSlotsContainer");
  if (slotsContainer) {
    slotsContainer.innerHTML = `<span style="color: var(--text-muted); font-size: 0.85rem;">Please select a doctor to view available consultation slots.</span>`;
  }
  selectedSlotTime = null;
}

/* ==========================================================
   2. URL Query Params Handler (e.g. from Symptom Checker or Directory)
   ========================================================== */
function getMedicareData() {
  if (typeof window !== "undefined" && window.MEDICARE_DATA) return window.MEDICARE_DATA;
  if (typeof MEDICARE_DATA !== "undefined") return MEDICARE_DATA;
  return null;
}

function handleUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const deptParam = params.get("dept");
  const docParam = params.get("doc");

  const deptSelect = document.getElementById("bookingDepartment");
  const data = getMedicareData();

  if (docParam && data) {
    const doc = data.doctors.find(d => d.id === docParam);
    if (doc) {
      if (deptSelect) deptSelect.value = doc.department;
      populateDoctorsDropdown(doc.department, doc.id);
      return;
    }
  }

  if (deptParam && deptSelect) {
    deptSelect.value = deptParam;
    populateDoctorsDropdown(deptParam);
  }
}

/* ==========================================================
   3. Booking Submission & LocalStorage Persistence
   ========================================================== */
function handleBookingSubmit(e) {
  e.preventDefault();

  const name = document.getElementById("patientName").value.trim();
  const phone = document.getElementById("patientPhone").value.trim();
  const email = document.getElementById("patientEmail").value.trim();
  const docId = document.getElementById("bookingDoctor").value;
  const date = document.getElementById("bookingDate").value;
  const reason = document.getElementById("bookingReason").value.trim();

  if (!name || !phone || !docId || !date) {
    showToast("Please fill all mandatory fields", "warning");
    return;
  }

  if (!selectedSlotTime) {
    showToast("Please select an appointment time slot", "warning");
    return;
  }

  const data = getMedicareData();
  const doctor = (data && data.doctors)
    ? data.doctors.find(d => d.id === docId)
    : { name: "Specialist Physician", departmentName: "Consultation", hospital: "Apollo Medicare City", fee: 500 };

  const appointmentId = "APT-" + Math.floor(10000 + Math.random() * 90000);

  const newAppointment = {
    id: appointmentId,
    patientName: name,
    patientPhone: phone,
    patientEmail: email || "N/A",
    doctorId: docId,
    doctorName: doctor ? doctor.name : "Specialist Physician",
    department: doctor ? doctor.departmentName : "General Medicine",
    hospital: doctor ? doctor.hospital : "Apollo Medicare City",
    date: date,
    time: selectedSlotTime,
    reason: reason || "General Medical Checkup",
    status: "Confirmed",
    fee: doctor ? doctor.fee : 500,
    createdAt: new Date().toISOString()
  };

  // Save to LocalStorage
  const existingAppts = JSON.parse(localStorage.getItem("medicare_appointments") || "[]");
  existingAppts.unshift(newAppointment);
  localStorage.setItem("medicare_appointments", JSON.stringify(existingAppts));

  showToast(`Appointment booked successfully! ID: ${appointmentId}`, "success");

  // Reset Form
  document.getElementById("appointmentBookingForm").reset();
  clearTimeSlots();

  // Re-render appointments list
  renderAppointmentsList();

  // Display Hospital Pass Modal
  showAppointmentSlipModal(newAppointment);
}

/* ==========================================================
   4. Render "My Appointments" Dashboard
   ========================================================== */
function renderAppointmentsList() {
  const container = document.getElementById("appointmentsListContainer");
  if (!container) return;

  const appointments = JSON.parse(localStorage.getItem("medicare_appointments") || "[]");

  if (appointments.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border);">
        <span style="font-size: 2.5rem; display: block; margin-bottom: 0.5rem;">📅</span>
        <h4 style="font-weight: 700; color: var(--text-main);">No Scheduled Appointments</h4>
        <p style="font-size: 0.9rem;">Book your first doctor consultation using the form on the left.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = "";

  appointments.forEach(apt => {
    const isCancelled = apt.status === "Cancelled";
    const itemCard = document.createElement("div");
    itemCard.className = "appointment-item";
    itemCard.innerHTML = `
      <div>
        <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem;">
          <span style="font-size: 0.8rem; font-weight: 700; color: var(--primary);">${apt.id}</span>
          <span class="appointment-badge ${isCancelled ? 'cancelled' : 'confirmed'}">${apt.status}</span>
        </div>
        <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.2rem;">${apt.doctorName}</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.3rem;">
          ${apt.department} • 🗓️ ${apt.date} at ⏰ ${apt.time}
        </p>
        <p style="font-size: 0.8rem; color: var(--text-muted);">
          Patient: <strong>${apt.patientName}</strong> (${apt.patientPhone})
        </p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.4rem; align-items: flex-end;">
        <button type="button" class="btn btn-outline btn-sm view-slip-btn" data-id="${apt.id}">
          📄 View Pass
        </button>
        ${!isCancelled ? `
          <button type="button" class="btn btn-danger btn-sm cancel-apt-btn" data-id="${apt.id}" style="padding: 0.25rem 0.65rem; font-size: 0.75rem;">
            Cancel
          </button>
        ` : ''}
      </div>
    `;

    container.appendChild(itemCard);
  });

  // Attach event listeners for Cancel and View buttons
  document.querySelectorAll(".cancel-apt-btn").forEach(btn => {
    btn.addEventListener("click", () => cancelAppointment(btn.dataset.id));
  });

  document.querySelectorAll(".view-slip-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const apt = appointments.find(a => a.id === btn.dataset.id);
      if (apt) showAppointmentSlipModal(apt);
    });
  });
}

function cancelAppointment(appointmentId) {
  if (!confirm(`Are you sure you wish to cancel appointment ${appointmentId}?`)) return;

  const appointments = JSON.parse(localStorage.getItem("medicare_appointments") || "[]");
  const target = appointments.find(a => a.id === appointmentId);
  if (target) {
    target.status = "Cancelled";
    localStorage.setItem("medicare_appointments", JSON.stringify(appointments));
    showToast(`Appointment ${appointmentId} has been cancelled`, "info");
    renderAppointmentsList();
  }
}

/* ==========================================================
   5. Modal & Hospital Appointment Slip Generator
   ========================================================== */
function initSlipModal() {
  const modal = document.getElementById("slipModal");
  const closeBtn = document.getElementById("closeSlipModal");
  const printBtn = document.getElementById("printSlipBtn");

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("active");
    });
  }

  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }

  // Close when clicking background overlay
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("active");
    });
  }
}

function showAppointmentSlipModal(apt) {
  const modal = document.getElementById("slipModal");
  const slipContainer = document.getElementById("appointmentSlipContent");
  if (!modal || !slipContainer) return;

  slipContainer.innerHTML = `
    <div class="appointment-slip">
      <div class="slip-header">
        <h2>🏥 MEDICARE+ HEALTHCARE PASS</h2>
        <p style="font-size: 0.8rem; color: #64748b;">Official OPD Appointment Receipt & Verification Pass</p>
      </div>

      <div class="slip-row">
        <span>Appointment ID:</span>
        <strong style="color: #0d9488;">${apt.id}</strong>
      </div>
      <div class="slip-row">
        <span>Patient Name:</span>
        <strong>${apt.patientName}</strong>
      </div>
      <div class="slip-row">
        <span>Contact Phone:</span>
        <strong>${apt.patientPhone}</strong>
      </div>
      <div class="slip-row">
        <span>Doctor In-Charge:</span>
        <strong>${apt.doctorName}</strong>
      </div>
      <div class="slip-row">
        <span>Department:</span>
        <strong>${apt.department}</strong>
      </div>
      <div class="slip-row">
        <span>Appointment Date:</span>
        <strong>${apt.date} (${apt.time})</strong>
      </div>
      <div class="slip-row">
        <span>Hospital Center:</span>
        <strong>${apt.hospital || "Apollo Medicare City"}</strong>
      </div>
      <div class="slip-row">
        <span>Consultation Fee:</span>
        <strong>₹${apt.fee || 500} (Pay at OPD Counter)</strong>
      </div>
      <div class="slip-row">
        <span>Current Status:</span>
        <strong style="color: ${apt.status === 'Cancelled' ? '#ef4444' : '#10b981'};">${apt.status}</strong>
      </div>

      <div class="slip-qr-box">
        <div class="slip-barcode">||| | |||| | ||| |||| |</div>
        <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.25rem;">VERIFICATION TOKEN: ${apt.id}</div>
      </div>

      <p style="text-align: center; font-size: 0.72rem; color: #94a3b8; margin-top: 1rem;">
        * Please arrive 15 minutes before your scheduled slot. Carry a valid photo ID card.
      </p>
    </div>
  `;

  modal.classList.add("active");
}
