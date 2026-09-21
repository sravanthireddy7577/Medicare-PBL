/**
 * MEDICARE+ - Interactive Health & Symptom Triage Wizard
 * Evaluates patient symptoms, calculates risk triage scores, and suggests medical specialties.
 */

let currentWizardStep = 1;
const selectedSymptomIds = new Set();

document.addEventListener("DOMContentLoaded", () => {
  renderSymptomChips();
  initWizardControls();
  initSeveritySlider();
});

function getMedicareData() {
  if (typeof window !== "undefined" && window.MEDICARE_DATA) return window.MEDICARE_DATA;
  if (typeof MEDICARE_DATA !== "undefined") return MEDICARE_DATA;
  return {
    departments: [
      { id: "all", name: "All Specialties" },
      { id: "cardiology", name: "Cardiology" },
      { id: "neurology", name: "Neurology" },
      { id: "pediatrics", name: "Pediatrics" },
      { id: "dermatology", name: "Dermatology" },
      { id: "orthopedics", name: "Orthopedics" },
      { id: "general", name: "General Medicine" }
    ],
    symptomsCatalog: [
      { id: "s-chest-pain", name: "Chest Pain / Tightness", category: "Chest & Heart", severityWeight: 5, dept: "cardiology" },
      { id: "s-palpitations", name: "Rapid or Irregular Heartbeat", category: "Chest & Heart", severityWeight: 4, dept: "cardiology" },
      { id: "s-short-breath", name: "Shortness of Breath", category: "Chest & Heart", severityWeight: 4, dept: "cardiology" },
      { id: "s-headache-severe", name: "Severe Persistent Headache", category: "Head & Neuro", severityWeight: 4, dept: "neurology" },
      { id: "s-dizziness", name: "Dizziness or Loss of Balance", category: "Head & Neuro", severityWeight: 3, dept: "neurology" },
      { id: "s-vision-blur", name: "Sudden Blurred Vision", category: "Head & Neuro", severityWeight: 4, dept: "neurology" },
      { id: "s-rash", name: "Skin Rash / Redness", category: "Skin", severityWeight: 2, dept: "dermatology" },
      { id: "s-itching", name: "Severe Itching or Hives", category: "Skin", severityWeight: 2, dept: "dermatology" },
      { id: "s-skin-lesion", name: "Unusual Moles or Skin Lesions", category: "Skin", severityWeight: 3, dept: "dermatology" },
      { id: "s-joint-pain", name: "Joint Stiffness or Pain", category: "Bones & Joints", severityWeight: 3, dept: "orthopedics" },
      { id: "s-back-pain", name: "Severe Lower Back Pain", category: "Bones & Joints", severityWeight: 3, dept: "orthopedics" },
      { id: "s-swollen-knee", name: "Swelling in Limbs or Joints", category: "Bones & Joints", severityWeight: 3, dept: "orthopedics" },
      { id: "s-fever-high", name: "High Fever (> 101°F)", category: "General", severityWeight: 3, dept: "general" },
      { id: "s-fatigue", name: "Extreme Fatigue & Weakness", category: "General", severityWeight: 2, dept: "general" },
      { id: "s-cough", name: "Persistent Cough / Sore Throat", category: "General", severityWeight: 2, dept: "general" },
      { id: "s-nausea", name: "Nausea, Vomiting or Stomach Pain", category: "General", severityWeight: 2, dept: "general" }
    ]
  };
}

/* ==========================================================
   1. Render Categorized Symptom Selection Chips
   ========================================================== */
function renderSymptomChips() {
  const container = document.getElementById("symptomsListContainer");
  const data = getMedicareData();
  if (!container || !data) return;

  const symptoms = data.symptomsCatalog;
  container.innerHTML = "";

  const categoryIcons = {
    "Chest & Heart": "❤️",
    "Head & Neuro": "🧠",
    "Skin": "🧴",
    "Bones & Joints": "🦴",
    "General": "🩺"
  };

  symptoms.forEach(sym => {
    const chip = document.createElement("div");
    chip.className = "symptom-chip";
    chip.dataset.id = sym.id;
    const icon = categoryIcons[sym.category] || "🩺";
    chip.innerHTML = `
      <span style="font-size: 1.2rem; flex-shrink: 0;">${icon}</span>
      <div style="flex: 1;">
        <div style="font-weight: 600; font-size: 0.92rem;">${sym.name}</div>
        <small style="color: var(--text-muted); font-size: 0.75rem;">${sym.category}</small>
      </div>
      <span class="chip-checkbox" style="font-size: 1.1rem; color: var(--primary); font-weight: bold;">☐</span>
    `;

    chip.addEventListener("click", () => {
      if (selectedSymptomIds.has(sym.id)) {
        selectedSymptomIds.delete(sym.id);
        chip.classList.remove("selected");
        chip.querySelector(".chip-checkbox").textContent = "☐";
      } else {
        selectedSymptomIds.add(sym.id);
        chip.classList.add("selected");
        chip.querySelector(".chip-checkbox").textContent = "☑";
      }
      updateSelectedCount();
    });

    container.appendChild(chip);
  });
}

function updateSelectedCount() {
  const countEl = document.getElementById("selectedCountText");
  if (countEl) {
    countEl.textContent = `${selectedSymptomIds.size} symptom(s) selected`;
  }
}

/* ==========================================================
   2. Severity Slider Update
   ========================================================== */
function initSeveritySlider() {
  const slider = document.getElementById("severitySlider");
  const valueDisplay = document.getElementById("severityValue");
  if (slider && valueDisplay) {
    slider.addEventListener("input", (e) => {
      valueDisplay.textContent = e.target.value;
    });
  }
}

/* ==========================================================
   3. Wizard Step Navigation Logic
   ========================================================== */
function initWizardControls() {
  const nextBtn = document.getElementById("wizardNextBtn");
  const prevBtn = document.getElementById("wizardPrevBtn");
  const restartBtn = document.getElementById("wizardRestartBtn");

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (validateCurrentStep()) {
        if (currentWizardStep < 3) {
          goToStep(currentWizardStep + 1);
        } else if (currentWizardStep === 3) {
          evaluateTriage();
          goToStep(4); // Results step
        }
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentWizardStep > 1) {
        goToStep(currentWizardStep - 1);
      }
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      selectedSymptomIds.clear();
      document.querySelectorAll(".symptom-chip").forEach(c => {
        c.classList.remove("selected");
        c.querySelector(".chip-checkbox").textContent = "☐";
      });
      document.getElementById("triageForm").reset();
      updateSelectedCount();
      goToStep(1);
    });
  }
}

function validateCurrentStep() {
  if (currentWizardStep === 1) {
    const age = document.getElementById("patientAge").value;
    if (!age || age < 1 || age > 120) {
      showToast("Please enter a valid age between 1 and 120", "warning");
      return false;
    }
    return true;
  }

  if (currentWizardStep === 2) {
    if (selectedSymptomIds.size === 0) {
      showToast("Please select at least one symptom to proceed", "warning");
      return false;
    }
    return true;
  }

  return true;
}

function goToStep(stepNumber) {
  currentWizardStep = stepNumber;

  // Update panes
  document.querySelectorAll(".wizard-pane").forEach(pane => {
    pane.classList.remove("active");
  });
  const targetPane = document.getElementById(`stepPane${stepNumber}`);
  if (targetPane) targetPane.classList.add("active");

  // Update indicators
  for (let i = 1; i <= 3; i++) {
    const ind = document.getElementById(`stepIndicator${i}`);
    if (ind) {
      ind.classList.remove("active", "completed");
      if (i < stepNumber) {
        ind.classList.add("completed");
        ind.innerHTML = "✓";
      } else if (i === stepNumber) {
        ind.classList.add("active");
        ind.textContent = i;
      } else {
        ind.textContent = i;
      }
    }
  }

  if (stepNumber === 2) {
    const container = document.getElementById("symptomsListContainer");
    if (container && container.children.length === 0) {
      renderSymptomChips();
    }
  }

  // Update button visibility
  const nextBtn = document.getElementById("wizardNextBtn");
  const prevBtn = document.getElementById("wizardPrevBtn");
  const restartBtn = document.getElementById("wizardRestartBtn");

  if (prevBtn) prevBtn.style.display = stepNumber === 1 || stepNumber === 4 ? "none" : "inline-flex";
  if (nextBtn) {
    nextBtn.style.display = stepNumber === 4 ? "none" : "inline-flex";
    nextBtn.textContent = stepNumber === 3 ? "Generate Assessment Report →" : "Next Step →";
  }
  if (restartBtn) restartBtn.style.display = stepNumber === 4 ? "inline-flex" : "none";
}

/* ==========================================================
   4. Triage Calculation & Recommendation Engine
   ========================================================== */
function evaluateTriage() {
  const data = getMedicareData();
  const symptoms = data.symptomsCatalog.filter(s => selectedSymptomIds.has(s.id));
  const severityVal = parseInt(document.getElementById("severitySlider").value) || 5;
  const durationVal = document.getElementById("symptomDuration").value;

  let durationMultiplier = 1.0;
  if (durationVal === "1-3days") durationMultiplier = 1.2;
  else if (durationVal === "1week") durationMultiplier = 1.4;
  else if (durationVal === "2weeks+") durationMultiplier = 1.6;

  // Calculate Base Severity Score
  let baseScore = symptoms.reduce((acc, curr) => acc + curr.severityWeight, 0);
  const totalScore = baseScore * durationMultiplier * (severityVal / 5);

  // Red-flag detection
  const hasChestPain = selectedSymptomIds.has("s-chest-pain");
  const hasShortBreath = selectedSymptomIds.has("s-short-breath");
  const hasSevereNeuro = selectedSymptomIds.has("s-vision-blur") || selectedSymptomIds.has("s-dizziness");

  const isEmergency = hasChestPain || (hasShortBreath && severityVal >= 7) || totalScore >= 20;
  const isModerate = totalScore >= 9 || hasSevereNeuro;

  // Find most frequent department
  const deptCount = {};
  symptoms.forEach(s => {
    deptCount[s.dept] = (deptCount[s.dept] || 0) + 1;
  });
  let recommendedDeptId = "general";
  let maxCount = 0;
  for (const [dept, count] of Object.entries(deptCount)) {
    if (count > maxCount) {
      maxCount = count;
      recommendedDeptId = dept;
    }
  }

  const deptObj = data.departments.find(d => d.id === recommendedDeptId) || { name: "General Medicine" };

  renderTriageResult({
    isEmergency,
    isModerate,
    totalScore: Math.round(totalScore),
    recommendedDeptName: deptObj.name,
    recommendedDeptId: recommendedDeptId,
    symptomsCount: symptoms.length
  });
}

function renderTriageResult(data) {
  const resultCard = document.getElementById("triageResultCard");
  const badgeEl = document.getElementById("triageBadge");
  const titleEl = document.getElementById("triageTitle");
  const descEl = document.getElementById("triageDescription");
  const deptEl = document.getElementById("triageDeptRecommendation");
  const ctaBtn = document.getElementById("triageBookingCTA");

  resultCard.className = "triage-result-card";

  if (data.isEmergency) {
    resultCard.classList.add("urgent");
    badgeEl.className = "triage-badge urgent";
    badgeEl.textContent = "🚨 High Priority / Urgent Consultation Needed";
    titleEl.textContent = "Immediate Medical Attention Advised";
    descEl.innerHTML = `Based on your reported symptoms (e.g. cardiac, respiratory, or high pain indicators), we recommend consulting a physician or visiting an emergency care facility promptly. <strong>Do not drive yourself if experiencing chest tightness or severe breathlessness.</strong>`;
  } else if (data.isModerate) {
    resultCard.classList.add("moderate");
    badgeEl.className = "triage-badge moderate";
    badgeEl.textContent = "⚠️ Moderate Severity - Medical Evaluation Recommended";
    titleEl.textContent = "Consultation Advised Within 24-48 Hours";
    descEl.textContent = `Your symptom profile indicates moderate discomfort that should be evaluated by a healthcare specialist to prevent complications. Keep hydrated and avoid strenuous activities.`;
  } else {
    resultCard.classList.add("low");
    badgeEl.className = "triage-badge low";
    badgeEl.textContent = "✓ Low Severity / Mild Symptoms";
    titleEl.textContent = "Home Rest & Supportive Self-Care";
    descEl.textContent = `Your reported symptoms appear mild. Rest adequately, stay hydrated, monitor for temperature fluctuations, and maintain healthy nutrition. If symptoms worsen after 48 hours, schedule an in-person consultation.`;
  }

  deptEl.innerHTML = `Recommended Specialist: <strong>${data.recommendedDeptName}</strong>`;

  // Set booking button to open appointments page pre-filtering this department
  ctaBtn.href = `appointments.html?dept=${data.recommendedDeptId}`;
  ctaBtn.textContent = `Book Appointment with ${data.recommendedDeptName} →`;
}
