   /* scripts.js
   - Robust handlers for overlay, read-more, nav toggle, flip-cards, and guarded form submission.
   - Works even when some elements are not present on a specific page.
*/

(function () {
  "use strict";

  /* ---------- Welcome overlay ---------- */
  window.addEventListener("load", function () {
    const overlay = document.getElementById("welcome-overlay");
    try {
      if (!overlay) return;
      // Only show once per session
      if (sessionStorage.getItem("welcomeShown")) {
        overlay.classList.add("hidden");
      } else {
        // allow it to be visible briefly, then hide gracefully
        setTimeout(() => {
          overlay.classList.add("hidden");
        }, 1400); // visible ~1.4s
        sessionStorage.setItem("welcomeShown", "yes");
      }
    } catch (err) {
      // silent fail-safe
      console.error("Overlay error:", err);
    }
  });

  /* ---------- Read more expanders ---------- */
  document.addEventListener("click", function (e) {
    const rm = e.target.closest && e.target.closest(".read-more");
    if (!rm) return;

    e.preventDefault();
    const card = rm.closest(".card-content");
    if (!card) return;

    const more = card.querySelector(".more-text");
    if (!more) return;

    const expanded = rm.getAttribute("aria-expanded") === "true";
    if (!expanded) {
      more.style.display = "inline";
      rm.textContent = "Read Less";
      rm.setAttribute("aria-expanded", "true");
    } else {
      more.style.display = "none";
      rm.textContent = "Read More";
      rm.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- Nav toggle (hamburger) ---------- */
  (function navToggleSetup() {
    const toggle = document.getElementById("navToggle");
    const nav = document.getElementById("primaryNav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      // swap icon for visual feedback
      const icon = toggle.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-bars", !isOpen);
        icon.classList.toggle("fa-xmark", isOpen);
      }
    });

    // close when clicking outside on small screens
    document.addEventListener("click", function (e) {
      if (!nav.classList.contains("open")) return;
      const withinNav = nav.contains(e.target) || toggle.contains(e.target);
      if (!withinNav) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        const icon = toggle.querySelector("i");
        if (icon) { icon.classList.remove("fa-xmark"); icon.classList.add("fa-bars"); }
      }
    });
  })();

  /* ---------- Flip cards (toppers / leadership) ---------- */
  (function flipCardsSetup() {
    const cards = document.querySelectorAll(".flip-card");
    if (!cards || !cards.length) return;

    cards.forEach(card => {
      // click to flip
      card.addEventListener("click", function () {
        card.classList.toggle("flipped");
        const pressed = card.getAttribute("aria-pressed") === "true";
        card.setAttribute("aria-pressed", String(!pressed));
      });

      // keyboard support (Enter / Space)
      card.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          card.click();
        }
      });
    });
  })();

  /* ---------- Guarded admission form submit (if present) ---------- */
  (function formSubmitGuard() {
    const form = document.getElementById("admissionForm");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const scriptURL = 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE'; // keep this placeholder
      const formData = new FormData(form);

      fetch(scriptURL, { method: 'POST', body: formData })
        .then(() => {
          alert("🎉 Your form has been submitted!");
          try { form.reset(); } catch (_) {}
        })
        .catch((error) => {
          alert("❌ There was an error. Please try again later.");
          console.error("Form submit error:", error);
        });
    });
  })();

  /* ---------- Misc: ensure images keep aspect & no layout shift ---------- */
  (function imagesEnhance() {
    // set decoding=async for images where supported
    document.querySelectorAll("img").forEach(img => {
      try { img.decoding = "async"; } catch (_) {}
    });
  })();

})();
