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
