/* =====================================================
   GLOBAL SCRIPT – SEO RANK ANALYZER
   REAL DATA • CLEAN • PRODUCTION READY
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
     RESULT PAGE – REAL SEO DATA
     ===================================== */
  const scoreEl = document.getElementById("scoreValue");
  const scoreCard = document.getElementById("scoreCard");
  const statusEl = document.getElementById("scanStatus");
  const downloadBtn = document.getElementById("downloadBtn");

  const failedBar = document.getElementById("failedBar");
  const warningBar = document.getElementById("warningBar");
  const passedBar = document.getElementById("passedBar");

  const failedLabel = document.getElementById("failedLabel");
  const warningLabel = document.getElementById("warningLabel");
  const passedLabel = document.getElementById("passedLabel");

  const scoreDesc = document.getElementById("scoreDescription");

  const issuesSection = document.getElementById("issuesSection");
  const onPageList = document.getElementById("onPageIssues");
  const technicalList = document.getElementById("technicalIssues");
  const contentList = document.getElementById("contentIssues");

  // Not on result page → exit safely
  if (!scoreEl || !scoreCard) return;

  /* ===== INITIAL UI STATE ===== */
  scoreEl.textContent = "0";
  if (downloadBtn) downloadBtn.classList.add("disabled");
  if (issuesSection) issuesSection.style.display = "none";

  /* =====================================
     GET WEBSITE URL FROM QUERY PARAM
     ===================================== */
  const params = new URLSearchParams(window.location.search);
  const site = params.get("site");

  if (!site) {
    if (statusEl) statusEl.textContent = "Invalid website URL ❌";
    return;
  }

  /* =====================================
     FETCH REAL SEO DATA FROM BACKEND
     ===================================== */
  fetch(`/api/audit?site=${encodeURIComponent(site)}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) throw new Error(data.error);
      startSeoAnimation(data);
    })
    .catch(err => {
      console.error("SEO audit failed:", err);
      if (statusEl) statusEl.textContent = "SEO analysis failed ❌";
    });

  /* =====================================
     MAIN ANIMATION CONTROLLER
     ===================================== */
  function startSeoAnimation(data) {

    const finalScore = data.score;
    const bars = data.bars;
    const issues = data.issues;

    /* ---------- SCORE STEPS ---------- */
    const steps = [
      { value: Math.min(20, finalScore), text: "Checking title & meta tags…" },
      { value: Math.min(40, finalScore), text: "Analyzing content quality…" },
      { value: Math.min(60, finalScore), text: "Reviewing technical SEO…" },
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
            revealIssues(issues);
          }
        }
      }, 25);
    }

    animateStep();

    /* ---------- SCORE COLOR ---------- */
    let scoreColor = "#22c55e";
    if (finalScore < 40) scoreColor = "#ef4444";
    else if (finalScore < 70) scoreColor = "#facc15";

    scoreEl.style.color = scoreColor;
    scoreCard.style.setProperty("--score-color", scoreColor);

    /* ---------- PROGRESS BARS ---------- */
    if (failedBar) setTimeout(() => failedBar.style.width = bars.failed + "%", 800);
    if (warningBar) setTimeout(() => warningBar.style.width = bars.warning + "%", 1200);
    if (passedBar) setTimeout(() => passedBar.style.width = bars.passed + "%", 1600);

    /* ---------- LABELS & DESCRIPTION ---------- */
    if (failedLabel) failedLabel.textContent = `${bars.failed} Failed`;
    if (warningLabel) warningLabel.textContent = `${bars.warning} Warnings`;
    if (passedLabel) passedLabel.textContent = `${bars.passed} Passed`;

    const totalIssues = bars.failed + bars.warning;
    if (scoreDesc) {
      scoreDesc.innerHTML = `
        This webpage received an SEO score of <b>${finalScore}</b> out of 100.
        Our analysis identified <b>${totalIssues}</b> SEO issues that can be improved.
      `;
    }
  }

  /* =====================================
     RENDER REAL ISSUES
     ===================================== */
  function revealIssues(issues) {
    setTimeout(() => {
      if (issuesSection) issuesSection.style.display = "block";

      renderIssues(onPageList, issues.onPage);
      renderIssues(technicalList, issues.technical);
      renderIssues(contentList, issues.content);
    }, 500);
  }

  function renderIssues(listEl, issues) {
    if (!listEl) return;
    listEl.innerHTML = "";

    if (!issues || issues.length === 0) {
      const li = document.createElement("li");
      li.className = "issue good";
      li.innerHTML = `
        <div class="issue-title">✅ No issues found</div>
        <div class="issue-desc">Everything looks good.</div>
      `;
      listEl.appendChild(li);
      return;
    }

    issues.forEach((text, i) => {
      let type = "warning";
      if (text.toLowerCase().includes("missing") || text.toLowerCase().includes("no ")) {
        type = "bad";
      }

      const li = document.createElement("li");
      li.className = `issue ${type}`;
      li.style.animationDelay = `${i * 0.15}s`;

      li.innerHTML = `
        <div class="issue-title">
          ${type === "bad" ? "❌" : "⚠️"} ${text}
        </div>
        <div class="issue-desc">
          ${type === "bad"
            ? "This issue should be fixed for better SEO performance."
            : "Consider improving this for higher rankings."}
        </div>
      `;

      listEl.appendChild(li);
    });
  }

});
