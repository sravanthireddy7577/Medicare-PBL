/**
 * MEDICARE+ - Health Vitals & Wellness Calculators
 * BMI Calculator with visual gauge, Water Intake recommendations, and Caloric BMR/TDEE estimator.
 */

document.addEventListener("DOMContentLoaded", () => {
  initBmiCalculator();
  initWaterCalculator();
  initCalorieCalculator();
});

/* ==========================================================
   1. BMI (Body Mass Index) Calculator
   ========================================================== */
function initBmiCalculator() {
  const form = document.getElementById("bmiForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const weight = parseFloat(document.getElementById("bmiWeight").value);
    const height = parseFloat(document.getElementById("bmiHeight").value);

    if (!weight || !height || height <= 0 || weight <= 0) {
      showToast("Please enter valid weight and height numbers", "warning");
      return;
    }

    // Height in meters
    const heightMeters = height / 100;
    const bmi = (weight / (heightMeters * heightMeters)).toFixed(1);

    const resultBox = document.getElementById("bmiResultBox");
    const bmiScore = document.getElementById("bmiScore");
    const bmiStatus = document.getElementById("bmiStatus");
    const bmiAdvice = document.getElementById("bmiAdvice");

    bmiScore.textContent = bmi;
    resultBox.style.display = "block";

    if (bmi < 18.5) {
      bmiStatus.textContent = "Underweight (< 18.5)";
      bmiStatus.style.color = "#38bdf8";
      bmiAdvice.textContent = "Consider a nutrient-rich diet with balanced proteins and healthy carbohydrates. Consult a nutritionist.";
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      bmiStatus.textContent = "Healthy Weight (18.5 - 24.9)";
      bmiStatus.style.color = "#10b981";
      bmiAdvice.textContent = "Great job! Your BMI is in the ideal range. Maintain your balanced diet and regular physical activity.";
    } else if (bmi >= 25.0 && bmi <= 29.9) {
      bmiStatus.textContent = "Overweight (25.0 - 29.9)";
      bmiStatus.style.color = "#f59e0b";
      bmiAdvice.textContent = "Incorporate 30 minutes of aerobic exercise daily and monitor refined sugar and saturated fat intake.";
    } else {
      bmiStatus.textContent = "Obesity Range (≥ 30.0)";
      bmiStatus.style.color = "#ef4444";
      bmiAdvice.textContent = "Elevated risk for cardiac and metabolic health. We advise scheduling a lifestyle consultation with a physician.";
    }
  });
}

/* ==========================================================
   2. Daily Water Intake Calculator
   ========================================================== */
function initWaterCalculator() {
  const form = document.getElementById("waterForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const weight = parseFloat(document.getElementById("waterWeight").value);
    const activity = document.getElementById("waterActivity").value;

    if (!weight || weight <= 0) {
      showToast("Please enter your body weight", "warning");
      return;
    }

    // Baseline: ~33ml per kg
    let liters = weight * 0.033;

    if (activity === "moderate") liters += 0.4;
    else if (activity === "active") liters += 0.8;

    const resultBox = document.getElementById("waterResultBox");
    const waterScore = document.getElementById("waterScore");
    const glassesEl = document.getElementById("waterGlasses");

    const totalLiters = liters.toFixed(1);
    const totalGlasses = Math.round((liters * 1000) / 250); // standard 250ml glass

    waterScore.textContent = `${totalLiters} Liters / day`;
    glassesEl.textContent = `Approx. ${totalGlasses} standard glasses (250 ml each) throughout the day.`;
    resultBox.style.display = "block";
  });
}

/* ==========================================================
   3. Caloric Need & BMR Calculator (Mifflin-St Jeor)
   ========================================================== */
function initCalorieCalculator() {
  const form = document.getElementById("calorieForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const gender = document.querySelector('input[name="gender"]:checked')?.value || "male";
    const age = parseInt(document.getElementById("calAge").value);
    const weight = parseFloat(document.getElementById("calWeight").value);
    const height = parseFloat(document.getElementById("calHeight").value);
    const activity = parseFloat(document.getElementById("calActivity").value) || 1.2;

    if (!age || !weight || !height) {
      showToast("Please complete all numeric fields", "warning");
      return;
    }

    // Mifflin-St Jeor Formula
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr += (gender === "male") ? 5 : -161;

    const tdee = Math.round(bmr * activity);
    const weightLoss = Math.round(tdee - 450);
    const weightGain = Math.round(tdee + 400);

    const resultBox = document.getElementById("calorieResultBox");
    document.getElementById("calMaintain").textContent = `${tdee.toLocaleString()} kcal`;
    document.getElementById("calLoss").textContent = `${weightLoss.toLocaleString()} kcal`;
    document.getElementById("calGain").textContent = `${weightGain.toLocaleString()} kcal`;

    resultBox.style.display = "block";
  });
}
