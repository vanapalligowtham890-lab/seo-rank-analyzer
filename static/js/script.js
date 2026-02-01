/* =====================================================
   GLOBAL SCRIPT – SEO RANK ANALYZER
   CLEAN • SAFE • PRODUCTION READY
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* =====================================
     HOME PAGE – CTA BUTTON
     ===================================== */
  const btn = document.getElementById("ctaBtn");

  if (btn) {
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
  }

  /* =====================================
     RESULT PAGE – LIVE SEO ANALYSIS
     ===================================== */
  const scoreEl = document.getElementById("scoreValue");
  const scoreCard = document.getElementById("scoreCard");
  const statusEl = document.getElementById("scanStatus");
  const downloadBtn = document.getElementById("downloadBtn");

  const failedBar = document.getElementById("failedBar");
  const warningBar = document.getElementById("warningBar");
  const passedBar = document.getElementById("passedBar");

  const issuesSection = document.getElementById("issuesSection");
  const onPageList = document.getElementById("onPageIssues");
  const technicalList = document.getElementById("technicalIssues");
  const contentList = document.getElementById("contentIssues");

  // Not on result page → exit safely
  if (!scoreEl || !scoreCard) return;

  /* ===== INITIAL STATE ===== */
  scoreEl.textContent = "0";
  if (downloadBtn) downloadBtn.classList.add("disabled");
  if (issuesSection) issuesSection.style.display = "none";

  /* ===== FINAL VALUES (backend later) ===== */
  const finalScore = 77;

  const barTargets = {
    failed: 25,
    warning: 10,
    passed: 70
  };

  /* =====================================
     STEP-BY-STEP SCORE ANIMATION
     ===================================== */
  const steps = [
    { value: 20, text: "Checking title & meta tags…" },
    { value: 30, text: "Analyzing content quality…" },
    { value: 40, text: "Reviewing technical SEO…" },
    { value: 55, text: "Evaluating internal links…" },
    { value: finalScore, text: "SEO analysis completed ✔" }
  ];

  let current = 0;
  let index = 0;

  function animateStep() {
    const target = steps[index].value;
    if (statusEl) statusEl.textContent = steps[index].text;

    const interval = setInterval(() => {
      current++;
      scoreEl.textContent = current;

      if (current >= target) {
        clearInterval(interval);
        index++;

        if (index < steps.length) {
          setTimeout(animateStep, 400);
        } else {
          // Scan finished
          if (downloadBtn) downloadBtn.classList.remove("disabled");
          revealIssues();
        }
      }
    }, 25);
  }

  animateStep();

  /* =====================================
     SCORE COLOR
     ===================================== */
  let scoreColor = "#22c55e"; // green
  if (finalScore < 40) scoreColor = "#ef4444";     // red
  else if (finalScore < 70) scoreColor = "#facc15"; // yellow

  scoreEl.style.color = scoreColor;
  scoreCard.style.setProperty("--score-color", scoreColor);

  /* =====================================
     PROGRESS BAR SEQUENCE
     ===================================== */
  if (failedBar) setTimeout(() => failedBar.style.width = barTargets.failed + "%", 800);
  if (warningBar) setTimeout(() => warningBar.style.width = barTargets.warning + "%", 1200);
  if (passedBar) setTimeout(() => passedBar.style.width = barTargets.passed + "%", 1600);

  /* =====================================
     SEO ISSUES (DEMO DATA – BACKEND READY)
     ===================================== */
  const issuesData = {
    onPage: [
      { type: "bad", text: "Meta description missing", fix: "Add a 150–160 character meta description." },
      { type: "warning", text: "H1 tag missing", fix: "Add exactly one H1 tag." }
    ],
    technical: [
      { type: "good", text: "HTTPS enabled", fix: "No action required." },
      { type: "warning", text: "Page speed is slow", fix: "Improve load time under 2.5s." }
    ],
    content: [
      { type: "warning", text: "Content length is low", fix: "Add at least 800 more words." }
    ]
  };

  function renderIssues(listEl, issues) {
    if (!listEl) return;

    issues.forEach((issue, i) => {
      const li = document.createElement("li");
      li.className = `issue ${issue.type}`;
      li.style.animationDelay = `${i * 0.15}s`;

      li.innerHTML = `
        <div class="issue-title">
          ${issue.type === "bad" ? "❌" : issue.type === "warning" ? "⚠️" : "✅"}
          ${issue.text}
        </div>
        <div class="issue-desc">${issue.fix}</div>
      `;

      listEl.appendChild(li);
    });
  }

  function revealIssues() {
    setTimeout(() => {
      if (issuesSection) issuesSection.style.display = "block";

      renderIssues(onPageList, issuesData.onPage);
      renderIssues(technicalList, issuesData.technical);
      renderIssues(contentList, issuesData.content);
    }, 500);
  }

});
