// Determine base path based on current location
const isInPagesFolder = window.location.pathname.includes('/pages/');
const basePath = isInPagesFolder ? '../' : '';
const pagesPath = isInPagesFolder ? '' : 'pages/';

// Footer HTML content
const footerHTML = `<footer class="site-footer">
  <div class="wrap footer-inner">
    <div class="footer-top">

      <div class="footer-columns">
        <div class="footer-col">
          <h4>Explore</h4>
          <ul>
            <li><a href="${basePath}${pagesPath}inspiration.html">Inspiration</a></li>
            <li><a href="${basePath}${pagesPath}planning.html">Travel Planning</a></li>
            <li><a href="${basePath}${pagesPath}about.html">About</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Important</h4>
          <ul>
            <li><a href="${basePath}${pagesPath}privacy.html">Privacy</a></li>
            <li><a href="${basePath}${pagesPath}terms.html">Terms</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Follow</h4>
          <div class="footer-social-icons" aria-label="Social links">
            <a class="social-icon" href="https://www.instagram.com/crafted.horizons/" target="_blank" rel="noreferrer" aria-label="Instagram">
              <!-- Instagram -->
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm9 2h-9A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm6-2.2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z"/>
              </svg>
            </a>

            <a class="social-icon" href="https://www.tiktok.com/@crafted.horizons" target="_blank" rel="noreferrer" aria-label="TikTok">
              <!-- TikTok (simple) -->
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14 2h2c.2 2 1.4 3.7 3.8 3.9v2.2c-1.6 0-3-.5-3.8-1.2V15a6 6 0 1 1-6.2-6v2.3A3.7 3.7 0 1 0 14 15V2Z"/>
              </svg>
            </a>

            <a class="social-icon" href="https://www.linkedin.com/in/aditidesai24/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <!-- LinkedIn -->
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-compliance">
      <p class="compliance-title">Travel protection &amp; compliance</p>
      <p class="compliance-text">
        Crafted Horizons is an affiliate of <strong>InteleTravel</strong>, who are <strong>ABTA &amp; ATOL-protected</strong>.
        Flight-inclusive package holidays are protected by our <strong>ATOL-protected partners</strong>.
      </p>
      <p class="compliance-note">
        Protections apply through the relevant supplier or provider used for your booking.
      </p>
    </div>

    <div class="footer-bottom">
      <p>© <span id="year"></span> Aditi Desai. All rights reserved.</p>
      <p class="footer-small">
        Crafted Horizons is a registered trade name. Content and images may not be reproduced without permission.
      </p>
      <p class="footer-small">
        <a href="${basePath}${pagesPath}privacy.html">Privacy</a> · <a href="${basePath}${pagesPath}terms.html">Terms</a>
      </p>
    </div>
  </div>
</footer>`;

// Load footer HTML into placeholder
document.addEventListener('DOMContentLoaded', function() {
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) {
    footerPlaceholder.innerHTML = footerHTML;

    // Update the year
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  }
});
