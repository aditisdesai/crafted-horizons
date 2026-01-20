# Header and Footer Includes

This project uses a modular approach for the site header and footer to avoid code duplication.

## Structure

- **header.html** - Contains the navigation menu
- **footer.html** - Contains the complete site footer
- **header-loader.js** - Loads and injects the header into pages
- **footer-loader.js** - Loads and injects the footer into pages

## How it Works

Each HTML page includes placeholders and loader scripts:

```html
<body>
  <!-- Header Placeholder -->
  <div id="header-placeholder"></div>
  <script src="header-loader.js"></script>

  <!-- Page content here -->
  <main>...</main>

  <!-- Footer Placeholder -->
  <div id="footer-placeholder"></div>
  <script src="footer-loader.js"></script>
</body>
```

The JavaScript loaders contain the header/footer HTML as embedded strings and inject them into the placeholders when the page loads. This approach works even when opening files locally (file:// protocol).

## Benefits

1. **Single Source of Truth** - Update the header or footer once, and all pages reflect the change
2. **Easy Maintenance** - No need to update multiple files when changing navigation or footer content
3. **Consistency** - Guaranteed identical header/footer across all pages
4. **Active Link Detection** - The header-loader automatically adds the "active" class to the current page's nav link

## Updating Header or Footer

To update the header or footer:

1. Edit the HTML content in `header-loader.js` (inside the `headerHTML` constant) or `footer-loader.js` (inside the `footerHTML` constant)
2. Optionally, also update `header.html` or `footer.html` (these files are kept as reference templates)
3. Refresh any page - changes will appear immediately
4. No need to edit individual page files

**Note:** The actual header/footer content is embedded in the JavaScript files, not loaded from the HTML files. This ensures compatibility with local file viewing.

## Files Using Includes

All HTML pages in the project use this system:
- index.html
- about.html
- planning.html
- inspiration.html
- deals.html
- experiences.html
- community.html
- lifestyle.html
- opportunity.html
- privacy.html
- terms.html
- thankyou.html

## Technical Notes

- The loaders embed HTML content as JavaScript template literals
- Headers and footers load using `DOMContentLoaded` event (synchronous after DOM is ready)
- Active navigation link is set automatically based on current page URL
- Works with both local files (file://) and web servers (http://)
- Compatible with all modern browsers that support ES6 template literals
