(function () {
  "use strict";

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  var header = document.getElementById("siteHeader");
  var navToggle = document.getElementById("navToggle");
  if (navToggle && header) {
    navToggle.addEventListener("click", function () {
      var isOpen = header.classList.toggle("nav-open");
      navToggle.classList.toggle("is-active", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
    header.querySelectorAll(".main-nav a").forEach(function (link) {
      link.addEventListener("click", function () {
        header.classList.remove("nav-open");
        navToggle.classList.remove("is-active");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Scroll reveal
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Fare estimator
  var vehicleButtons = document.querySelectorAll(".vehicle-btn");
  var distanceRange = document.getElementById("distanceRange");
  var distanceInput = document.getElementById("distanceInput");
  var estimateAmount = document.getElementById("estimateAmount");
  var estimateWhatsapp = document.getElementById("estimateWhatsapp");

  var currentRate = 12;
  var currentName = "Swift Dzire";

  function formatINR(amount) {
    return "₹" + Math.round(amount).toLocaleString("en-IN");
  }

  function updateEstimate() {
    var distance = parseInt(distanceInput.value, 10) || 0;
    var fare = currentRate * distance;
    if (estimateAmount) estimateAmount.textContent = formatINR(fare);

    if (estimateWhatsapp) {
      var message =
        "Hi Yavnika Tours, I'd like a quote for " +
        currentName +
        " over " +
        distance +
        " km. Estimated fare: " +
        formatINR(fare) +
        ". Please confirm availability.";
      estimateWhatsapp.href = "https://wa.me/919685027118?text=" + encodeURIComponent(message);
    }
  }

  vehicleButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      vehicleButtons.forEach(function (b) {
        b.classList.remove("is-active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");
      currentRate = parseFloat(btn.dataset.rate);
      currentName = btn.dataset.name;
      updateEstimate();
    });
  });

  if (distanceRange && distanceInput) {
    distanceRange.addEventListener("input", function () {
      distanceInput.value = distanceRange.value;
      updateEstimate();
    });
    distanceInput.addEventListener("input", function () {
      var val = Math.max(1, Math.min(2000, parseInt(distanceInput.value, 10) || 0));
      if (val <= parseInt(distanceRange.max, 10)) distanceRange.value = val;
      updateEstimate();
    });
  }

  updateEstimate();
})();
