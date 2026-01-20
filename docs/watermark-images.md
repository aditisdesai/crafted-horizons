# Image Protection Guide

To protect your travel photos from being copied, consider adding subtle watermarks.

## Option 1: Online Tools (Easiest)

Use free online watermarking tools:
- **Watermarkly.com** - Bulk watermark your images
- **Canva.com** - Add text watermarks to images
- **Photopea.com** - Free Photoshop alternative

## Option 2: Batch Watermark Script

If you have ImageMagick installed, you can batch watermark all images:

```bash
# Install ImageMagick first
brew install imagemagick  # macOS
# or
sudo apt-get install imagemagick  # Linux

# Watermark all images in a directory
for img in images/**/*.{jpg,jpeg,png}; do
  magick "$img" \
    -gravity southeast \
    -pointsize 20 \
    -fill "rgba(255,255,255,0.6)" \
    -annotate +10+10 "© Crafted Horizons" \
    "$img"
done
```

## Recommended Watermark Style

- **Position:** Bottom-right corner
- **Text:** "© Crafted Horizons" or "© Aditi Desai"
- **Opacity:** 50-70% (subtle but visible)
- **Size:** Small, doesn't distract from image

## Alternative: Right-Click Protection

Add this JavaScript to prevent easy image downloads:

```javascript
// Disable right-click on images
document.addEventListener('contextmenu', function(e) {
  if (e.target.tagName === 'IMG') {
    e.preventDefault();
    return false;
  }
});

// Disable drag and drop for images
document.addEventListener('dragstart', function(e) {
  if (e.target.tagName === 'IMG') {
    e.preventDefault();
    return false;
  }
});
```

**Note:** This won't stop determined users, but it prevents casual copying.

## CSS Protection

Add to your CSS to make images harder to save:

```css
img {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  pointer-events: none;
}

/* But allow other interactions on the page */
a, button, input, textarea {
  pointer-events: auto;
}
```

## Best Practice

The most effective protection is a combination:
1. ✅ Subtle watermark on images
2. ✅ Copyright notice in footer
3. ✅ Clear LICENSE.md file
4. ✅ DMCA monitoring (Google can alert you to copied content)
