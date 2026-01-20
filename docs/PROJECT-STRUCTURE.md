# Project Structure

This document describes the organized folder structure for the Crafted Horizons website.

## Directory Layout

```
/
├── index.html              # Homepage (stays in root for GitHub Pages)
├── site.webmanifest        # PWA manifest
├── robots.txt              # Search engine directives
├── sitemap.xml             # XML sitemap
├── CNAME                   # Custom domain configuration
├── README.md               # Project overview
│
├── /pages/                 # All HTML pages except index
│   ├── about.html
│   ├── inspiration.html
│   ├── planning.html
│   ├── privacy.html
│   ├── terms.html
│   └── thankyou.html
│
├── /css/                   # Stylesheets
│   └── styles.css
│
├── /js/                    # JavaScript files
│   ├── header-loader.js    # Loads navigation on all pages
│   ├── footer-loader.js    # Loads footer on all pages
│   ├── carousel.js         # Image carousel functionality
│   ├── more-carousel.js    # Secondary carousel
│   └── form-validation.js  # Form validation logic
│
├── /assets/                # Static assets
│   └── /brand/            # Brand logos and favicons
│       ├── favicon.ico
│       ├── favicon-*.png
│       ├── apple-touch-icon-*.png
│       ├── android-chrome-*.png
│       └── social-square-*.png
│
├── /images/                # Content images
│   ├── hero-*.jpg         # Hero banner images
│   ├── /inspiration/      # Travel destination photos
│   ├── /opportunity/      # Opportunity images
│   └── /ME/               # Personal photos
│
├── /templates/             # Reusable HTML templates
│   ├── header.html
│   ├── footer.html
│   └── favicon-meta-tags.html
│
├── /tests/                 # Test suite
│   ├── test.js            # Automated tests (Node.js)
│   └── test-suite.html    # Test results viewer
│
├── /docs/                  # Project documentation
│   ├── PROJECT-STRUCTURE.md (this file)
│   ├── BRAND-ASSETS-SETUP.md
│   ├── DEPLOYMENT.md
│   ├── LAUNCH_SUMMARY.md
│   ├── LICENSE.md
│   ├── CHANGES-SUMMARY.md
│   ├── FORM-STATUS.md
│   ├── FORM-VALIDATION.md
│   ├── FORMSUBMIT-SETUP.md
│   ├── README-includes.md
│   └── watermark-images.md
│
└── /.github/               # GitHub Actions workflows
    └── /workflows/
        └── deploy.yml
```

## Key Design Decisions

### Why `index.html` stays in root
GitHub Pages requires `index.html` in the root directory to serve as the homepage.

### Why pages are in `/pages/`
- Clean organization separates main content from supporting files
- Easier maintenance and file discovery
- Clear separation between public pages and templates

### Why JavaScript is in `/js/`
- Standard convention for JavaScript files
- Makes it clear what files are executable code
- Easier to configure build tools or bundlers in the future

### Why CSS is in `/css/`
- Standard convention for stylesheets
- Allows for future expansion (multiple CSS files, preprocessors)
- Clear separation of styling from markup

### Path Handling

#### Header and Footer Loaders
Both `header-loader.js` and `footer-loader.js` automatically detect whether they're loaded from the root or pages folder and adjust paths accordingly:

```javascript
const isInPagesFolder = window.location.pathname.includes('/pages/');
const basePath = isInPagesFolder ? '../' : '';
const pagesPath = isInPagesFolder ? '' : 'pages/';
```

This means:
- When loaded from `index.html`: Links to `pages/about.html`
- When loaded from `pages/planning.html`: Links to `about.html` (same folder)

#### Image Paths
- From root pages: `images/hero.jpg`
- From `/pages/` folder: `../images/hero.jpg`

#### CSS and JS References
- From root pages: `css/styles.css`, `js/header-loader.js`
- From `/pages/` folder: `../css/styles.css`, `../js/header-loader.js`

## Testing

Run the automated test suite to verify all paths and links work correctly:

```bash
node tests/test.js
```

The test suite validates:
- All required files exist in correct locations
- All internal links work correctly
- Image paths resolve properly
- CSS and JavaScript load correctly
- Forms submit to correct endpoints

## Maintenance

When adding new files:

1. **New HTML page**: Add to `/pages/` folder, copy header/footer structure from existing pages
2. **New JavaScript**: Add to `/js/` folder
3. **New CSS**: Consider adding to existing `styles.css` or create new file in `/css/`
4. **New images**: Add to appropriate subfolder in `/images/`
5. **New documentation**: Add to `/docs/` folder

When updating paths:
- Always use relative paths (no leading `/`)
- Test from both root and pages folder
- Run test suite to verify no broken links

## Deployment

The site is deployed via GitHub Pages from the `main` branch. The reorganized structure maintains compatibility with GitHub Pages hosting.

---

**Last Updated**: 2026-01-20
**Status**: ✅ Reorganized and tested (84/84 tests passing)
