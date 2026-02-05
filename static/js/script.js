/* =====================================================
   GLOBAL SCRIPT – SEO RANK ANALYZER
   MODERN DONUT • SMOOTH ANIMATION • PRODUCTION READY
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
      btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0, 0)";
    });
  }

  /* =====================================
     RESULT PAGE ELEMENTS
     ===================================== */
  const scoreEl = document.getElementById("scoreValue");
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

  if (!scoreEl) {
  console.warn("Score element not found, skipping animation");
}


  /* =====================================
     INITIAL STATE
     ===================================== */
  scoreEl.textContent = "0";
  if (downloadBtn) downloadBtn.classList.add("disabled");
  if (issuesSection) issuesSection.style.display = "none";

  /* =====================================
     GET SITE FROM URL
     ===================================== */
  const params = new URLSearchParams(window.location.search);
  const site = params.get("site");

  if (!site) {
    if (statusEl) statusEl.textContent = "Invalid website URL ❌";
    return;
  }

  /* =====================================
     FETCH SEO DATA
     ===================================== */
  fetch(`/api/audit?site=${encodeURIComponent(site)}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) throw new Error(data.error);
      startSeoAnimation(data);
    })
    .catch(() => {
      if (statusEl) statusEl.textContent = "SEO analysis failed ❌";
    });

  /* =====================================
     TYPEWRITER EFFECT
     ===================================== */
  function typeText(el, text) {
    el.textContent = "";
    let i = 0;
    const timer = setInterval(() => {
      el.textContent += text[i++];
      if (i >= text.length) clearInterval(timer);
    }, 28);
  }

  /* =====================================
     🎯 DONUT SCORE ANIMATION (IMAGE-2 STYLE)
     ===================================== */
  function animateDonutScore(score) {
    const circle = document.querySelector(".donut-fill");
    if (!circle) return;

    const radius = 85;
    const circumference = 2 * Math.PI * radius;

    // reset
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference;
    circle.getBoundingClientRect(); // force reflow

    // color by score
    let color = "#22c55e";       // green
    if (score < 40) color = "#ef4444";      // red
    else if (score < 75) color = "#f59e0b"; // yellow

    const offset = circumference - (score / 100) * circumference;
    circle.style.stroke = color;
    circle.style.strokeDashoffset = offset;
  }

  /* =====================================
     MAIN SEO ANIMATION FLOW
     ===================================== */
  function startSeoAnimation(data) {

    const finalScore = data.score;
    const bars = data.bars;
    const issues = data.issues;

    const steps = [
      { value: 20, text: "Checking title & meta tags…" },
      { value: 40, text: "Analyzing content quality…" },
      { value: 60, text: "Reviewing technical SEO…" },
      { value: finalScore, text: "SEO analysis completed ✔" }
    ];

    let current = 0;
    let stepIndex = 0;

    function animateScore() {
      const target = steps[stepIndex].value;
      typeText(statusEl, steps[stepIndex].text);

      const interval = setInterval(() => {
        current++;
        scoreEl.textContent = current;

        if (current >= target) {
          clearInterval(interval);
          stepIndex++;

          if (stepIndex < steps.length) {
            setTimeout(animateScore, 350);
          } else {
            animateDonutScore(finalScore);
            animateBars(bars);
            enableDownloadButton();
            revealIssues(issues);
          }
        }
      }, 18);
    }

    animateScore();

    if (scoreDesc) {
      scoreDesc.innerHTML = `
        This webpage received an SEO score of <b>${finalScore}</b>/100.
        Our analysis identified <b>${bars.failed + bars.warning}</b> SEO issues.
      `;
    }
  }

  /* =====================================
     PROGRESS BARS ANIMATION
     ===================================== */
  function animateBars(bars) {
    setTimeout(() => {
      if (failedBar) failedBar.style.width = bars.failed + "%";
      if (warningBar) warningBar.style.width = bars.warning + "%";
      if (passedBar) passedBar.style.width = bars.passed + "%";

      if (failedLabel) failedLabel.textContent = `${bars.failed} Failed`;
      if (warningLabel) warningLabel.textContent = `${bars.warning} Warnings`;
      if (passedLabel) passedLabel.textContent = `${bars.passed} Passed`;
    }, 900);
  }

  /* =====================================
     DOWNLOAD PDF BUTTON
     ===================================== */
  function enableDownloadButton() {
    if (!downloadBtn) return;

    downloadBtn.classList.remove("disabled");

    downloadBtn.onclick = () => {
      downloadBtn.classList.add("downloading");
      downloadBtn.innerHTML = "Preparing report…";

      setTimeout(() => {
        window.location.href = `/download-pdf?site=${encodeURIComponent(site)}`;
        downloadBtn.innerHTML = "Downloaded ✔";

        setTimeout(() => {
          downloadBtn.innerHTML = "⬇ Download PDF";
        }, 2500);
      }, 1200);
    };
  }

  /* =====================================
     ISSUES RENDER
     ===================================== */
  function revealIssues(issues) {
    setTimeout(() => {
      if (issuesSection) issuesSection.style.display = "block";
      renderIssues(onPageList, issues.onPage);
      renderIssues(technicalList, issues.technical);
      renderIssues(contentList, issues.content);
    }, 600);
  }

  function renderIssues(listEl, issues) {
    if (!listEl) return;
    listEl.innerHTML = "";

    if (!issues || issues.length === 0) {
      listEl.innerHTML = `<li class="issue good">✅ No issues found</li>`;
      return;
    }

    issues.forEach((text, i) => {
      const li = document.createElement("li");
      li.className = "issue";
      li.style.animationDelay = `${i * 0.12}s`;
      li.textContent = text;
      listEl.appendChild(li);
    });
  }

});
