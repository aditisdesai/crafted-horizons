# Form Validation & Error Handling

Client-side validation for the travel planning form with comprehensive error handling and user feedback.

## Features

### ✅ Real-time Validation

- **On Blur**: Fields are validated when the user leaves them
- **On Input**: Errors clear as the user corrects them
- **On Submit**: Full form validation before submission

### ✅ Progress Tracking

- Visual progress bar updates as required fields are filled
- Minimum 12% width for better visibility
- Smooth animations

### ✅ Required Field Validation

All required fields are validated:
- **Name** - Must not be empty
- **Email** - Must be valid email format (name@example.com)
- **Dates** - Must provide travel dates
- **Travellers** - Must specify who's travelling
- **Consent** - Must agree to be contacted

### ✅ Email Validation

- Uses regex pattern: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Validates format even for optional email fields if filled
- Clear error message with example format

### ✅ Phone Validation (Optional)

- If phone number is provided, validates format
- Accepts various formats: +44 123 456 7890, (123) 456-7890, etc.
- Only validates if field is not empty

### ✅ Spam Protection

- Honeypot field (`_gotcha`) checked on submission
- Silent failure if honeypot is filled (spam bots)

## Error States

### Visual Feedback

**Input Fields:**
```css
- Red border (#d32f2f)
- Light red background (rgba(211, 47, 47, 0.05))
- Red focus shadow
- aria-invalid="true" for screen readers
```

**Error Messages:**
```
⚠ Please enter a valid email address
```
- Red text with warning icon
- Appears below the field
- Uses role="alert" for accessibility

**Checkbox Errors:**
- Red outline around checkbox
- Error message below

### Form-Level Messages

**Error Message:**
```
⚠ Please fix the errors above before submitting
```
- Appears at top of form
- Smooth slide-in animation
- Scrolls into view

**Success Message** (if needed):
```
✓ Form submitted successfully
```
- Auto-dismisses after 5 seconds

## Accessibility

### ARIA Attributes

- `aria-invalid="true"` added to fields with errors
- `role="alert"` on error messages
- `role="status"` on success messages

### Keyboard Navigation

- First error field receives focus on validation failure
- Smooth scroll to error location
- All form elements keyboard accessible

### Screen Readers

- Error messages announced immediately
- Clear validation feedback
- Proper field labeling

## User Experience

### Smooth Interactions

1. **User fills field** → Progress bar updates
2. **User leaves field** → Validation runs (if filled)
3. **Error found** → Red highlight + message appears
4. **User corrects** → Error clears immediately
5. **User submits** → All fields validated
6. **Errors found** → Scroll to first error + focus
7. **Valid** → Submit button shows "Sending..." state

### Progressive Enhancement

- Form works without JavaScript (basic HTML5 validation)
- JavaScript adds enhanced validation and UX
- Fallback to server-side validation

## Button States

### Normal State
```html
<button class="btn primary" type="submit">Send my enquiry</button>
```

### Loading State
```html
<button class="btn primary loading" type="submit" disabled>Sending...</button>
```
- Disabled to prevent double-submission
- Shows spinning indicator
- Reduced opacity

## Files

- **form-validation.js** - Validation logic (205 lines)
- **styles.css** - Error styling (added ~120 lines)
- **planning.html** - Form structure with validation

## Testing Checklist

### Required Field Tests

- [ ] Try to submit with empty name field
- [ ] Try to submit with empty email field
- [ ] Try to submit with empty dates field
- [ ] Try to submit with empty travellers field
- [ ] Try to submit without consent checkbox

### Email Tests

- [ ] Enter invalid email: "test"
- [ ] Enter invalid email: "test@"
- [ ] Enter invalid email: "test@domain"
- [ ] Enter valid email: "test@domain.com"

### Phone Tests

- [ ] Leave phone empty (should be valid - optional)
- [ ] Enter short phone: "123" (should error if filled)
- [ ] Enter valid phone: "+44 20 1234 5678" (should be valid)

### UX Tests

- [ ] Fill a required field → Check progress bar updates
- [ ] Leave a field with error → Check error appears
- [ ] Fix the error → Check error disappears
- [ ] Submit with errors → Check scroll to first error
- [ ] Submit valid form → Check button shows "Sending..."

### Accessibility Tests

- [ ] Navigate form with Tab key
- [ ] Test with screen reader (VoiceOver/NVDA)
- [ ] Check error announcements
- [ ] Verify focus management

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Android)

Requires ES6 support (arrow functions, template literals, const/let).

## Customization

### Changing Validation Messages

Edit the `validationMessages` object in form-validation.js:

```javascript
const validationMessages = {
  name: 'Your custom message',
  email: 'Your custom email message',
  // ... etc
};
```

### Changing Error Colors

Edit styles.css:

```css
.field input.error {
  border-color: #your-color;
  background: rgba(your-color, 0.05);
}
```

### Adding New Field Validation

In form-validation.js, add to the `validateField` function:

```javascript
// Custom validation
if (name === 'your-field-name') {
  if (/* your condition */) {
    showError(input, 'Your error message');
    return false;
  }
}
```
