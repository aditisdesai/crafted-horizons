# FormSubmit Setup Guide

## The Issue

FormSubmit's error message "Form should POST" can be misleading. The actual issues are:

1. **FormSubmit requires a live web URL** - It won't work with `file://` local files
2. **Redirect URLs must be absolute** - Relative paths like `thankyou.html` don't work

## Solutions

### Option 1: For Local Testing (Recommended)

**Remove the `_next` redirect temporarily:**

```html
<form action="https://formsubmit.co/aditi@crafted-horizons.com" method="POST">
  <input type="hidden" name="_captcha" value="false">
  <input type="hidden" name="_subject" value="New trip enquiry — Crafted Horizons">
  <input type="hidden" name="_template" value="table">
  <!-- No _next redirect - will use FormSubmit's default thank you page -->
```

**What happens:**
- Form submits successfully
- You see FormSubmit's default "Thank you" page
- You still receive the email at aditi@crafted-horizons.com
- Good for testing the form submission

### Option 2: For Production (When Deployed)

**Use absolute URL for redirect:**

```html
<form action="https://formsubmit.co/aditi@crafted-horizons.com" method="POST">
  <input type="hidden" name="_captcha" value="false">
  <input type="hidden" name="_subject" value="New trip enquiry — Crafted Horizons">
  <input type="hidden" name="_next" value="https://crafted-horizons.com/thankyou.html">
  <input type="hidden" name="_template" value="table">
```

**Requirements:**
- Your site must be deployed to a live web server (not local files)
- Replace `https://crafted-horizons.com` with your actual domain
- The redirect URL must be an absolute URL (include https://)

### Option 3: Use a Local Web Server

Instead of opening HTML files directly (`file://`), run a local web server:

**Python (if installed):**
```bash
# In your project directory
python3 -m http.server 8000

# Then open: http://localhost:8000/planning.html
```

**Node.js (if installed):**
```bash
# Install serve globally
npm install -g serve

# Run server
serve

# Then open: http://localhost:3000/planning.html
```

**VS Code Live Server Extension:**
1. Install "Live Server" extension
2. Right-click planning.html
3. Select "Open with Live Server"
4. Opens at http://127.0.0.1:5500/planning.html

With a local server, you can use:
```html
<input type="hidden" name="_next" value="http://localhost:8000/thankyou.html">
```

## First-Time Setup Steps

### 1. Verify Your Email (First Submission Only)

On your **first form submission**, FormSubmit will:
1. Send you a verification email to `aditi@crafted-horizons.com`
2. Show a message: "Please verify your email address"
3. You must click the verification link in the email

After verification, all future submissions work automatically.

### 2. Test the Form

**For Local Testing:**
1. Remove or comment out the `_next` line in planning.html
2. Fill out the form with test data
3. Submit the form
4. Check your email for:
   - Verification email (first time only)
   - Test form submission

**For Production Testing:**
1. Deploy your site to a web host
2. Update `_next` with your actual domain URL
3. Test the full flow including redirect

## Current Configuration

Your form is now configured for **production** with custom redirect:

```html
<input type="hidden" name="_next" value="https://crafted-horizons.com/thankyou.html">
```

**Important:** This redirect will only work when your site is deployed to `https://crafted-horizons.com`.

For local testing, the form will still submit successfully, but FormSubmit will show its default thank you page because it can't redirect to a domain that's not yet live.

## Troubleshooting

### "Form should POST" Error
- ✅ Your form already has `method="POST"` - this is correct
- ❌ The error appears because of redirect URL issues
- **Solution:** Remove `_next` for testing, or use absolute URL

### "Confirm your email" Message
- This is normal for first submission
- Check `aditi@crafted-horizons.com` for verification email
- Click the link in the email
- Resubmit the form

### Form Doesn't Submit
- Make sure you're using a web server (not file://)
- Check browser console for JavaScript errors
- Verify all required fields are filled
- Check that validation passes

### Email Not Received
1. Check spam folder
2. Verify you clicked the verification link (first time)
3. Check FormSubmit configuration
4. Test with a different email address

## Deployment Checklist

When you're ready to deploy:

- [ ] Deploy site to web hosting (Netlify, Vercel, GitHub Pages, etc.)
- [ ] Update `_next` redirect URL with your actual domain
- [ ] Uncomment the `_next` line in planning.html
- [ ] Test form submission on live site
- [ ] Verify email arrives correctly
- [ ] Verify redirect to thankyou.html works

## Recommended Hosts

**Free Options:**
- **Netlify** - Best for static sites, easy deployment
- **Vercel** - Great performance, automatic HTTPS
- **GitHub Pages** - Free for public repos

All of these work perfectly with FormSubmit!
