export function validateEmail(email) {
  if (!email || !email.trim()) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) return 'Please provide a valid email';
  return null;
}

export function validateRequired(val, fieldName = 'Field') {
  if (val === undefined || val === null || String(val).trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
}

export function validateNumber(val, fieldName = 'Field', min = 0, max = Infinity) {
  if (val === undefined || val === null || val === '') return `${fieldName} is required`;
  const num = Number(val);
  if (isNaN(num)) return `${fieldName} must be a number`;
  if (num < min) return `${fieldName} must be at least ${min}`;
  if (num > max) return `${fieldName} must be at most ${max}`;
  return null;
}

export function validateContactForm({ name, email, message }) {
  const errors = {};
  if (!name || !name.trim()) errors.name = 'Name is required';
  
  const emailErr = validateEmail(email);
  if (emailErr) errors.email = emailErr;

  if (!message || message.trim().length < 10) {
    errors.message = 'Message must contain at least 10 characters';
  }
  return errors;
}
