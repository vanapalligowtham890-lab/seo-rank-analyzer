const btn = document.getElementById("ctaBtn");

btn.addEventListener("mousemove", (e) => {
  const rect = btn.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;

  btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
});

btn.addEventListener("mouseleave", () => {
  btn.style.transform = "translate(0, 0)";
});

btn.addEventListener("click", () => {
  btn.classList.add("loading");
});
const form = document.getElementById("auditForm");
const page = document.getElementById("auditPage");
const card = document.querySelector(".audit-card");

form.addEventListener("submit", function (e) {
  e.preventDefault(); // stop instant navigation

  // add exit animations
  page.classList.add("page-exit");
  card.classList.add("card-exit");

  // delay actual submit (backend) after animation
  setTimeout(() => {
    form.submit();
  }, 500);
});
const targetScore = 78; // demo value (later from backend)

const scoreEl = document.getElementById("scoreValue");
const needle = document.getElementById("needle");
const arc = document.querySelector(".speedo-fill");

/* Count number */
let current = 0;
const counter = setInterval(() => {
  if (current >= targetScore) {
    clearInterval(counter);
  } else {
    current++;
    scoreEl.textContent = current;
  }
}, 25);

/* Animate needle */
const needleAngle = -90 + targetScore * 1.8;
needle.style.transform = `rotate(${needleAngle}deg)`;

/* Animate arc */
arc.style.strokeDashoffset = 100 - targetScore;

/* Change color based on score */
if (targetScore < 40) {
  arc.style.stroke = "#ef4444";
} else if (targetScore < 70) {
  arc.style.stroke = "#facc15";
} else {
  arc.style.stroke = "#38bdf8";
}
document.addEventListener("DOMContentLoaded", () => {

  // DEMO SCORE (later from backend)
  const targetScore = 78;

  const scoreEl = document.getElementById("scoreValue");
  const needle = document.getElementById("needle");
  const arc = document.querySelector(".speedo-fill");

  // Safety check
  if (!scoreEl || !needle || !arc) {
    console.warn("Speedometer elements not found");
    return;
  }

  /* ===== Number Counter ===== */
  let current = 0;
  const counter = setInterval(() => {
    if (current >= targetScore) {
      clearInterval(counter);
    } else {
      current++;
      scoreEl.textContent = current;
    }
  }, 25);

  /* ===== Arc Animation ===== */
  arc.style.strokeDashoffset = 100 - targetScore;

  /* ===== Needle Rotation ===== */
  const angle = -90 + targetScore * 1.8; // -90° to +90°
  needle.style.transform = `rotate(${angle}deg)`;

  /* ===== Color Logic ===== */
  if (targetScore < 40) {
    arc.style.stroke = "#ef4444"; // red
    scoreEl.style.color = "#ef4444";
  } else if (targetScore < 70) {
    arc.style.stroke = "#facc15"; // yellow
    scoreEl.style.color = "#facc15";
  } else {
    arc.style.stroke = "#38bdf8"; // blue
    scoreEl.style.color = "#38bdf8";
  }

});
