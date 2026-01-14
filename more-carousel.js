/**
 * More Holiday Experiences Carousel
 * Auto-scrolling infinite carousel with lightbox functionality
 */

(function () {
  // -------- Auto-scrolling horizontal carousel --------
  const track = document.querySelector("[data-more-track]");
  if (!track) return;

  const originals = Array.from(track.children);

  // Clone items multiple times for seamless infinite scroll
  if (originals.length > 0) {
    // Create 3 sets of clones for smooth infinite scrolling
    const clone1 = originals.map((el) => el.cloneNode(true));
    const clone2 = originals.map((el) => el.cloneNode(true));

    clone1.forEach((n) => track.appendChild(n));
    clone2.forEach((n) => track.appendChild(n));

    let scrollPosition = 0;
    let animationId;
    const scrollSpeed = 0.5; // pixels per frame (slower = smoother)

    // Calculate the width of one complete set of items
    let segmentWidth = 0;

    requestAnimationFrame(() => {
      const gap = 12;
      segmentWidth = originals.reduce((sum, el) => sum + el.getBoundingClientRect().width + gap, 0);

      // Start auto-scrolling
      function autoScroll() {
        scrollPosition += scrollSpeed;

        // Reset position when we've scrolled past one full segment
        if (scrollPosition >= segmentWidth) {
          scrollPosition = 0;
        }

        track.scrollLeft = scrollPosition;
        animationId = requestAnimationFrame(autoScroll);
      }

      autoScroll();
    });

    // Pause on hover
    track.addEventListener('mouseenter', () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    });

    // Resume on mouse leave
    track.addEventListener('mouseleave', () => {
      function autoScroll() {
        scrollPosition = track.scrollLeft;
        scrollPosition += scrollSpeed;

        if (scrollPosition >= segmentWidth) {
          scrollPosition = 0;
        }

        track.scrollLeft = scrollPosition;
        animationId = requestAnimationFrame(autoScroll);
      }
      autoScroll();
    });
  }

  // -------- Lightbox --------
  const lb = document.getElementById("moreLightbox");
  const lbImg = document.getElementById("moreLbImg");
  const lbCap = document.getElementById("moreLbCap");
  const lbClose = document.getElementById("moreLbClose");

  function openLb(src, cap) {
    lbImg.src = src;
    lbImg.alt = cap || "";
    lbCap.textContent = cap || "";
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
  }

  function closeLb() {
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    lbImg.src = "";
  }

  document.addEventListener("click", (e) => {
    const item = e.target.closest(".more-item");
    if (!item) return;
    const img = item.querySelector("img");
    const cap = item.querySelector(".more-label")?.textContent || img?.alt || "";
    if (img?.src) openLb(img.src, cap);
  });

  lbClose?.addEventListener("click", closeLb);
  lb?.addEventListener("click", (e) => {
    if (e.target === lb) closeLb();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLb();
  });
})();
