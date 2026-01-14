/**
 * Carousel initialization for Crafted Horizons
 * Handles image carousel functionality with touch/swipe support and navigation
 */

(function () {
  /**
   * Initialize all carousels on the page
   */
  function initCarousels() {
    const carousels = document.querySelectorAll(".destination-carousel");

    carousels.forEach((carousel) => {
      const track = carousel.querySelector(".carousel-track");
      const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
      const prevBtn = carousel.querySelector(".carousel-btn.prev");
      const nextBtn = carousel.querySelector(".carousel-btn.next");
      const dotsContainer = carousel.querySelector(".carousel-dots");

      // Find caption element in parent card
      const card = carousel.closest(".destination-card");
      const captionElement = card ? card.querySelector(".destination-caption") : null;

      if (!track || slides.length === 0) return;

      let currentSlide = 0;
      const totalSlides = slides.length;

      // Mark single vs multiple slides for CSS styling
      carousel.setAttribute("data-slides", totalSlides > 1 ? "multiple" : "single");

      // If only one slide, set caption once and exit
      if (totalSlides === 1) {
        const caption = slides[0].dataset.caption;
        if (caption && captionElement) {
          captionElement.textContent = caption;
        }
        return;
      }

      // Build navigation dots
      dotsContainer.innerHTML = "";
      const dots = slides.map((_, i) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "carousel-dot" + (i === 0 ? " active" : "");
        btn.setAttribute("aria-label", `Go to image ${i + 1}`);
        btn.addEventListener("click", () => goToSlide(i));
        dotsContainer.appendChild(btn);
        return btn;
      });

      /**
       * Update carousel UI to reflect current slide
       */
      function updateCarousel() {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;

        // Update active dot
        dots.forEach((dot, index) => {
          dot.classList.toggle("active", index === currentSlide);
        });

        // Update caption from current slide's data-caption attribute
        const caption = slides[currentSlide].dataset.caption;
        if (caption && captionElement) {
          captionElement.textContent = caption;
        }

        // Disable navigation buttons at carousel ends (optional)
        if (prevBtn) prevBtn.disabled = currentSlide === 0;
        if (nextBtn) nextBtn.disabled = currentSlide === totalSlides - 1;
      }

      /**
       * Navigate to specific slide
       * @param {number} n - Slide index to navigate to
       */
      function goToSlide(n) {
        currentSlide = Math.max(0, Math.min(totalSlides - 1, n));
        updateCarousel();
      }

      /**
       * Navigate to next slide
       */
      function nextSlide() {
        if (currentSlide < totalSlides - 1) {
          currentSlide++;
          updateCarousel();
        }
      }

      /**
       * Navigate to previous slide
       */
      function prevSlide() {
        if (currentSlide > 0) {
          currentSlide--;
          updateCarousel();
        }
      }

      // Attach button event listeners
      if (prevBtn) prevBtn.addEventListener("click", prevSlide);
      if (nextBtn) nextBtn.addEventListener("click", nextSlide);

      // Touch/swipe support for mobile
      let startX = 0;
      let deltaX = 0;
      let isTouching = false;

      carousel.addEventListener("touchstart", (e) => {
        isTouching = true;
        startX = e.touches[0].clientX;
        deltaX = 0;
      }, { passive: true });

      carousel.addEventListener("touchmove", (e) => {
        if (!isTouching) return;
        deltaX = e.touches[0].clientX - startX;
      }, { passive: true });

      carousel.addEventListener("touchend", () => {
        if (!isTouching) return;
        isTouching = false;

        // Trigger slide change if swipe exceeds threshold
        if (deltaX > 50) {
          prevSlide();
        } else if (deltaX < -50) {
          nextSlide();
        }
      });

      // Initialize carousel
      updateCarousel();
    });
  }

  // Initialize carousels when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCarousels);
  } else {
    initCarousels();
  }
})();

// Footer year update
document.addEventListener("DOMContentLoaded", () => {
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});


