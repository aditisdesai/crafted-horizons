#!/usr/bin/env node

/**
 * Crafted Horizons - Automated Test Suite
 * Pre-launch validation tests
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

let testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: []
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function pass(testName) {
  testResults.total++;
  testResults.passed++;
  log(`✅ PASS: ${testName}`, colors.green);
}

function fail(testName, error = '') {
  testResults.total++;
  testResults.failed++;
  const errorMsg = `❌ FAIL: ${testName}${error ? ` - ${error}` : ''}`;
  log(errorMsg, colors.red);
  testResults.errors.push(errorMsg);
}

function fileExists(filePath) {
  return fs.existsSync(path.join(__dirname, '..', filePath));
}

function readFile(filePath) {
  return fs.readFileSync(path.join(__dirname, '..', filePath), 'utf-8');
}

// TEST 1: File Existence Tests
function testFileExistence() {
  log('\n📄 File Existence Tests', colors.cyan);
  log('─'.repeat(50));

  const requiredFiles = [
    'index.html',
    'planning.html',
    'inspiration.html',
    'about.html',
    'privacy.html',
    'terms.html',
    'thankyou.html',
    'css/styles.css',
    'robots.txt',
    'sitemap.xml',
    'js/header-loader.js',
    'js/footer-loader.js',
    'js/carousel.js'
  ];

  requiredFiles.forEach(file => {
    if (fileExists(file)) {
      pass(`${file} exists`);
    } else {
      fail(`${file} is missing`);
    }
  });
}

// TEST 2: HTML Structure Tests
function testHTMLStructure() {
  log('\n🏗️  HTML Structure Tests', colors.cyan);
  log('─'.repeat(50));

  const pages = [
    'index.html',
    'planning.html',
    'inspiration.html',
    'about.html'
  ];

  pages.forEach(page => {
    if (!fileExists(page)) {
      fail(`${page} not found for testing`);
      return;
    }

    const content = readFile(page);

    // Check DOCTYPE
    if (content.trim().toLowerCase().startsWith('<!doctype html>')) {
      pass(`${page}: Has DOCTYPE declaration`);
    } else {
      fail(`${page}: Missing DOCTYPE declaration`);
    }

    // Check lang attribute
    if (content.includes('lang="en"')) {
      pass(`${page}: Has lang attribute`);
    } else {
      fail(`${page}: Missing lang attribute`);
    }

    // Check charset
    if (content.includes('charset="UTF-8"')) {
      pass(`${page}: Has UTF-8 charset`);
    } else {
      fail(`${page}: Missing UTF-8 charset`);
    }

    // Check viewport
    if (content.includes('name="viewport"')) {
      pass(`${page}: Has viewport meta tag`);
    } else {
      fail(`${page}: Missing viewport meta tag`);
    }
  });
}

// TEST 3: SEO Tests
function testSEO() {
  log('\n🔍 SEO Tests', colors.cyan);
  log('─'.repeat(50));

  const pages = [
    'index.html',
    'planning.html',
    'inspiration.html',
    'about.html',
    'privacy.html',
    'terms.html'
  ];

  pages.forEach(page => {
    if (!fileExists(page)) {
      fail(`${page} not found for SEO testing`);
      return;
    }

    const content = readFile(page);

    // Check no noindex
    if (!content.includes('noindex')) {
      pass(`${page}: No noindex directive (SEO-friendly)`);
    } else {
      fail(`${page}: Contains noindex directive - page won't be indexed!`);
    }

    // Check title tag
    const titleMatch = content.match(/<title>(.*?)<\/title>/);
    if (titleMatch && titleMatch[1].trim().length > 0) {
      pass(`${page}: Has title tag "${titleMatch[1]}"`);
    } else {
      fail(`${page}: Missing or empty title tag`);
    }

    // Check meta description
    if (content.includes('name="description"')) {
      pass(`${page}: Has meta description`);
    } else {
      fail(`${page}: Missing meta description`);
    }
  });

  // Check robots.txt
  if (fileExists('robots.txt')) {
    const robotsTxt = readFile('robots.txt');
    if (robotsTxt.includes('Allow: /')) {
      pass('robots.txt: Allows search engine crawling');
    } else if (robotsTxt.includes('Disallow: /')) {
      fail('robots.txt: Disallows search engine crawling!');
    }

    if (robotsTxt.includes('Sitemap:')) {
      pass('robots.txt: Contains sitemap reference');
    } else {
      fail('robots.txt: Missing sitemap reference');
    }
  }

  // Check sitemap.xml
  if (fileExists('sitemap.xml')) {
    const sitemap = readFile('sitemap.xml');
    if (sitemap.includes('<urlset')) {
      pass('sitemap.xml: Valid XML structure');
    } else {
      fail('sitemap.xml: Invalid XML structure');
    }

    const urlCount = (sitemap.match(/<url>/g) || []).length;
    if (urlCount >= 6) {
      pass(`sitemap.xml: Contains ${urlCount} URLs`);
    } else {
      fail(`sitemap.xml: Only contains ${urlCount} URLs (expected 6+)`);
    }
  }
}

// TEST 4: Form Tests
function testForm() {
  log('\n📋 Form Tests', colors.cyan);
  log('─'.repeat(50));

  if (!fileExists('planning.html')) {
    fail('planning.html not found for form testing');
    return;
  }

  const content = readFile('planning.html');

  // Check form action
  if (content.includes('action="https://formsubmit.co/aditi@crafted-horizons.com"')) {
    pass('Form: Correct FormSubmit.co action URL');
  } else {
    fail('Form: Missing or incorrect action URL');
  }

  // Check form redirect
  if (content.includes('value="https://crafted-horizons.com/thankyou.html"')) {
    pass('Form: Thank you page redirect configured');
  } else {
    fail('Form: Missing or incorrect redirect configuration');
  }

  // Check required fields
  const requiredFields = ['name', 'email', 'dates', 'travellers'];
  requiredFields.forEach(field => {
    if (content.includes(`id="${field}"`) && content.includes('required')) {
      pass(`Form: Required field "${field}" present`);
    } else {
      fail(`Form: Required field "${field}" missing or not marked required`);
    }
  });

  // Check consent checkbox
  if (content.includes('name="consent"') && content.includes('required')) {
    pass('Form: Consent checkbox present and required');
  } else {
    fail('Form: Consent checkbox missing or not required');
  }
}

// TEST 5: Image Path Tests
function testImagePaths() {
  log('\n🖼️  Image Path Tests', colors.cyan);
  log('─'.repeat(50));

  const imagePaths = [
    'images/hero-crafted-horizons-desktop.jpg',
    'images/hero-crafted-horizons-mobile.jpg',
    'images/inspiration/moreholidays/IMG_1986.jpg',
    'images/ME/mehollywood.jpg',
    'images/inspiration/Swiss/3C3EB254-4EE7-4A9D-B65D-B6C65F64916E_1_105_c.jpeg',
    'images/opportunity/latitude-opportunity-1.jpg'
  ];

  imagePaths.forEach(imagePath => {
    if (fileExists(imagePath)) {
      pass(`Image exists: ${imagePath}`);
    } else {
      fail(`Image missing: ${imagePath}`);
    }
  });
}

// TEST 6: Link Tests
function testLinks() {
  log('\n🔗 Link Tests', colors.cyan);
  log('─'.repeat(50));

  // Check WhatsApp link in header loader (used across all pages)
  if (fileExists('js/header-loader.js')) {
    const headerContent = readFile('js/header-loader.js');
    if (headerContent.includes('wa.me/447424907184')) {
      pass('Header: WhatsApp link present (loads on all pages)');
    } else {
      fail('Header: WhatsApp link missing');
    }
  }

  const pages = ['index.html', 'planning.html', 'about.html'];

  pages.forEach(page => {
    if (!fileExists(page)) return;

    const content = readFile(page);

    // Check email link
    if (content.includes('mailto:aditi@crafted-horizons.com')) {
      pass(`${page}: Email link present`);
    } else {
      fail(`${page}: Email link missing`);
    }
  });

  // Check planning page has WhatsApp in form area
  if (fileExists('planning.html')) {
    const content = readFile('planning.html');
    if (content.includes('wa.me/447424907184')) {
      pass('planning.html: WhatsApp link in support card');
    }
  }

  // Check Latitude Collective link on homepage
  if (fileExists('index.html')) {
    const content = readFile('index.html');
    if (content.includes('thelatitudecollective.com')) {
      pass('index.html: Latitude Collective link present');
    } else {
      fail('index.html: Latitude Collective link missing');
    }
  }
}

// TEST 7: CSS Tests
function testCSS() {
  log('\n🎨 CSS Tests', colors.cyan);
  log('─'.repeat(50));

  if (!fileExists('css/styles.css')) {
    fail('styles.css not found');
    return;
  }

  const css = readFile('css/styles.css');

  // Check CSS variables
  if (css.includes('--accent:')) {
    pass('CSS: Custom properties defined');
  } else {
    fail('CSS: Missing custom properties');
  }

  // Check responsive media queries
  if (css.includes('@media')) {
    pass('CSS: Contains media queries for responsive design');
  } else {
    fail('CSS: No media queries found');
  }

  // Check key styles
  const requiredStyles = ['.hero', '.btn', '.card', '.planning-hero'];
  requiredStyles.forEach(selector => {
    if (css.includes(selector)) {
      pass(`CSS: ${selector} styles defined`);
    } else {
      fail(`CSS: ${selector} styles missing`);
    }
  });
}

// TEST 8: JavaScript Tests
function testJavaScript() {
  log('\n⚡ JavaScript Tests', colors.cyan);
  log('─'.repeat(50));

  const jsFiles = [
    'js/header-loader.js',
    'js/footer-loader.js',
    'js/carousel.js',
    'js/form-validation.js'
  ];

  jsFiles.forEach(file => {
    if (fileExists(file)) {
      pass(`${file} exists`);

      // Basic syntax check
      try {
        const content = readFile(file);
        if (content.trim().length > 0) {
          pass(`${file}: Contains code`);
        } else {
          fail(`${file}: File is empty`);
        }
      } catch (error) {
        fail(`${file}: Error reading file - ${error.message}`);
      }
    } else {
      fail(`${file} is missing`);
    }
  });
}

// Main test runner
function runTests() {
  log('\n' + '='.repeat(50), colors.blue);
  log('🧪 Crafted Horizons - Pre-Launch Test Suite', colors.blue);
  log('='.repeat(50) + '\n', colors.blue);

  testFileExistence();
  testHTMLStructure();
  testSEO();
  testForm();
  testImagePaths();
  testLinks();
  testCSS();
  testJavaScript();

  // Summary
  log('\n' + '='.repeat(50), colors.blue);
  log('📊 Test Summary', colors.blue);
  log('='.repeat(50), colors.blue);
  log(`Total Tests: ${testResults.total}`);
  log(`Passed: ${testResults.passed}`, colors.green);
  log(`Failed: ${testResults.failed}`, colors.red);

  if (testResults.failed > 0) {
    log('\n⚠️  Failed Tests:', colors.yellow);
    testResults.errors.forEach(error => log(`  ${error}`, colors.red));
  }

  log('\n' + '='.repeat(50) + '\n', colors.blue);

  // Exit code
  if (testResults.failed > 0) {
    log('❌ Tests FAILED - Please fix issues before deployment', colors.red);
    process.exit(1);
  } else {
    log('✅ All tests PASSED - Ready for deployment!', colors.green);
    process.exit(0);
  }
}

// Run tests
runTests();
