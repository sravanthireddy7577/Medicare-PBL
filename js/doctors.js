/**
 * MEDICARE+ - Doctor Directory Script
 * Live search, department filtering, and dynamic doctor card rendering.
 */

let activeDepartment = "all";
let searchQuery = "";

document.addEventListener("DOMContentLoaded", () => {
  renderDepartmentFilterPills();
  renderDoctorCards();
  initSearchInput();
});

/* ==========================================================
   1. Render Specialty Filter Pills
   ========================================================== */
function renderDepartmentFilterPills() {
  const container = document.getElementById("departmentPillsContainer");
  const data = window.MEDICARE_DATA || (typeof MEDICARE_DATA !== "undefined" ? MEDICARE_DATA : null);
  if (!container || !data) return;

  container.innerHTML = "";

  data.departments.forEach(dept => {
    const pill = document.createElement("button");
    pill.type = "button";
    pill.className = `filter-pill ${dept.id === activeDepartment ? "active" : ""}`;
    pill.textContent = dept.name;

    pill.addEventListener("click", () => {
      document.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      activeDepartment = dept.id;
      renderDoctorCards();
    });

    container.appendChild(pill);
  });
}

/* ==========================================================
   2. Search Input Listener
   ========================================================== */
function initSearchInput() {
  const searchInput = document.getElementById("doctorSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderDoctorCards();
    });
  }
}

/* ==========================================================
   3. Render Doctor Directory Cards
   ========================================================== */
function renderDoctorCards() {
  const container = document.getElementById("doctorsGridContainer");
  const countEl = document.getElementById("doctorResultsCount");
  const data = window.MEDICARE_DATA || (typeof MEDICARE_DATA !== "undefined" ? MEDICARE_DATA : null);
  if (!container || !data) return;

  const doctors = data.doctors;

  // Filter by department and search text
  const filtered = doctors.filter(doc => {
    const matchesDept = activeDepartment === "all" || doc.department === activeDepartment;
    const matchesSearch = searchQuery === "" ||
      doc.name.toLowerCase().includes(searchQuery) ||
      doc.qualification.toLowerCase().includes(searchQuery) ||
      doc.hospital.toLowerCase().includes(searchQuery) ||
      doc.departmentName.toLowerCase().includes(searchQuery);

    return matchesDept && matchesSearch;
  });

  if (countEl) {
    countEl.textContent = `Showing ${filtered.length} verified specialist(s)`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border);">
        <span style="font-size: 3rem; display: block; margin-bottom: 0.5rem;">🔍</span>
        <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.25rem;">No Specialists Found</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem;">
          No doctors match your search for "${searchQuery}". Try selecting another specialty or clearing the search.
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = "";

  filtered.forEach(doc => {
    const card = document.createElement("div");
    card.className = "doctor-card";
    card.innerHTML = `
      <div class="doctor-header">
        <div class="doctor-avatar">${doc.avatar}</div>
        <div class="doctor-info">
          <h3>${doc.name}</h3>
          <p class="doctor-spec">${doc.departmentName}</p>
          <p class="doctor-exp">${doc.experience}</p>
          <div class="doctor-rating">
            <span>★ ${doc.rating}</span>
            <span style="color: var(--text-muted); font-weight: normal; font-size: 0.75rem;">(${doc.reviewsCount} reviews)</span>
          </div>
        </div>
      </div>

      <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem; flex: 1;">
        ${doc.bio}
      </p>

      <div class="doctor-details">
        <div class="doctor-detail-item">
          <span>HOSPITAL</span>
          <strong style="font-size: 0.8rem;">${doc.hospital.split(',')[0]}</strong>
        </div>
        <div class="doctor-detail-item">
          <span>CONSULTATION FEE</span>
          <strong style="color: var(--primary);">₹${doc.fee}</strong>
        </div>
      </div>

      <div style="display: flex; gap: 0.5rem; margin-top: auto;">
        <a href="appointments.html?doc=${doc.id}" class="btn btn-primary" style="width: 100%;">
          Book Appointment →
        </a>
      </div>
    `;

    container.appendChild(card);
  });
}
