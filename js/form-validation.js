// Form validation and error handling for planning.html
document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form[action*="formsubmit.co"]');
  if (!form) return;

  // Progress bar update
  const progressBar = document.getElementById('formProgress');
  const updateProgress = () => {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    const filled = Array.from(inputs).filter(input => {
      if (input.type === 'checkbox') return input.checked;
      if (input.tagName === 'SELECT') return input.value !== '';
      return input.value.trim() !== '';
    }).length;
    const progress = (filled / inputs.length) * 100;
    if (progressBar) {
      progressBar.style.width = `${Math.max(12, progress)}%`;
    }
  };

  // Add event listeners for progress tracking
  form.addEventListener('input', updateProgress);
  form.addEventListener('change', updateProgress);

  // Custom validation messages
  const validationMessages = {
    name: 'Please enter your name',
    email: 'Please enter a valid email address',
    dates: 'Please provide approximate dates for your trip',
    adults: 'Please select number of adults',
    kids: 'Please select number of kids',
    kidsAges: 'Please enter the ages of the children',
    consent: 'You must consent to being contacted to submit this enquiry'
  };

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Show error message
  const showError = (input, message) => {
    // Remove any existing error
    removeError(input);

    // Add error class to input
    input.classList.add('error');
    input.setAttribute('aria-invalid', 'true');

    // Create and insert error message
    const errorDiv = document.createElement('p');
    errorDiv.className = 'error-message';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.textContent = message;

    const field = input.closest('.field') || input.closest('.consent');
    if (field) {
      field.appendChild(errorDiv);
    } else {
      input.parentNode.insertBefore(errorDiv, input.nextSibling);
    }
  };

  // Remove error message
  const removeError = (input) => {
    input.classList.remove('error');
    input.removeAttribute('aria-invalid');

    const field = input.closest('.field') || input.closest('.consent');
    if (field) {
      const errorMsg = field.querySelector('.error-message');
      if (errorMsg) errorMsg.remove();
    }
  };

  // Validate individual field
  const validateField = (input) => {
    const value = input.value.trim();
    const type = input.type;
    const name = input.name;
    const id = input.id;

    // Remove existing error
    removeError(input);

    // Required field validation
    if (input.hasAttribute('required')) {
      if (type === 'checkbox' && !input.checked) {
        showError(input, validationMessages[name] || validationMessages[id] || 'This field is required');
        return false;
      }

      if (input.tagName === 'SELECT' && value === '') {
        showError(input, validationMessages[name] || validationMessages[id] || 'Please make a selection');
        return false;
      }

      if (value === '' && type !== 'checkbox' && input.tagName !== 'SELECT') {
        showError(input, validationMessages[name] || validationMessages[id] || 'This field is required');
        return false;
      }
    }

    // Email validation
    if (type === 'email' && value !== '') {
      if (!emailRegex.test(value)) {
        showError(input, 'Please enter a valid email address (e.g., name@example.com)');
        return false;
      }
    }

    // Phone validation (if filled)
    if (type === 'tel' && value !== '') {
      const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
      if (!phoneRegex.test(value)) {
        showError(input, 'Please enter a valid phone number');
        return false;
      }
    }

    return true;
  };

  // Clear errors when user starts typing/changing (non-blocking)
  const inputs = form.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    // Remove error as soon as user interacts
    input.addEventListener('input', () => removeError(input));
    input.addEventListener('change', () => removeError(input));
  });

  // Form submission handling
  form.addEventListener('submit', function(e) {
    let isValid = true;
    let firstError = null;

    // Validate all required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      if (!validateField(field)) {
        isValid = false;
        if (!firstError) firstError = field;
      }
    });

    // Validate email even if not required but has value
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput && emailInput.value.trim() !== '') {
      if (!validateField(emailInput)) {
        isValid = false;
        if (!firstError) firstError = emailInput;
      }
    }

    // Check honeypot
    const honeypot = form.querySelector('input[name="_gotcha"]');
    if (honeypot && honeypot.value !== '') {
      e.preventDefault();
      console.log('Spam detected');
      return false;
    }

    // If validation failed, prevent submission
    if (!isValid) {
      e.preventDefault();

      // Scroll to first error
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => firstError.focus(), 300);
      }

      // Show general error message
      showFormMessage('Please fix the highlighted fields before submitting', 'error');
      return false;
    }

    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      submitButton.classList.add('loading');
    }

    // Form is valid, allow submission
    return true;
  });

  // Show form-level message
  const showFormMessage = (message, type) => {
    // Remove existing messages
    const existingMsg = form.querySelector('.form-message');
    if (existingMsg) existingMsg.remove();

    // Create message element
    const msgDiv = document.createElement('div');
    msgDiv.className = `form-message form-message-${type}`;
    msgDiv.setAttribute('role', type === 'error' ? 'alert' : 'status');
    msgDiv.textContent = message;

    // Insert at top of form
    const formHeader = form.querySelector('.trip-form-head');
    if (formHeader) {
      formHeader.after(msgDiv);
    } else {
      form.insertBefore(msgDiv, form.firstChild);
    }

    // Scroll to message
    msgDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Auto-remove error messages after 8 seconds
    if (type === 'error') {
      setTimeout(() => {
        if (msgDiv.parentNode) msgDiv.remove();
      }, 8000);
    }

    // Auto-remove success messages after 5 seconds
    if (type === 'success') {
      setTimeout(() => msgDiv.remove(), 5000);
    }
  };

  // Initialize progress
  updateProgress();
});
