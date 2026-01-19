// Header HTML content
const headerHTML = `<!-- Navigation -->
<nav class="nav">
  <div class="wrap nav-inner">
    <a href="index.html" class="logo">Crafted Horizons</a>
    <div class="nav-links">
      <a href="inspiration.html" class="nav-link">Inspiration</a>
      <a href="planning.html" class="nav-link">Travel Planning</a>
      <a href="about.html" class="nav-link">About</a>
      <a
        href="https://www.thelatitudecollective.com"
        class="nav-link nav-link-external"
        target="_blank"
        rel="noopener"
      >
        A longer-term horizon ✨
      </a>
    </div>
  </div>
</nav>`;

// Load header HTML into placeholder
document.addEventListener('DOMContentLoaded', function() {
  const headerPlaceholder = document.getElementById('header-placeholder');
  if (headerPlaceholder) {
    headerPlaceholder.innerHTML = headerHTML;

    // Set active class on current page's nav link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('active');
      }
    });
  }
});
