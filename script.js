// Form validation functions
function validateName(name) {
  return name.trim().length >= 2;
}

function validateMobile(mobile) {
  // Basic validation for phone numbers (allows different formats)
  const mobilePattern = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return mobilePattern.test(mobile);
}

function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function validateMessage(message) {
  return message.trim().length >= 10;
}

// Handle form submission
document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent the default form submission
  
  const formResponse = document.getElementById("formResponse");
  formResponse.className = "";
  formResponse.style.display = "none";
  
  // Get values from the form fields
  const name = document.getElementById("name").value;
  const mobile = document.getElementById("mobile").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;
  
  // Validate form inputs
  let isValid = true;
  let errorMessage = "";
  
  if (!validateName(name)) {
    isValid = false;
    errorMessage = "Please enter a valid name (at least 2 characters).";
  } else if (!validateMobile(mobile)) {
    isValid = false;
    errorMessage = "Please enter a valid mobile number.";
  } else if (!validateEmail(email)) {
    isValid = false;
    errorMessage = "Please enter a valid email address.";
  } else if (!validateMessage(message)) {
    isValid = false;
    errorMessage = "Please enter a message (at least 10 characters).";
  }
  
  if (!isValid) {
    formResponse.textContent = errorMessage;
    formResponse.className = "error-message";
    formResponse.style.display = "block";
    return;
  }
  
  try {
    // Show loading state
    const submitButton = document.querySelector('.submit-btn');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = "Submitting...";
    submitButton.disabled = true;
    
    // Define Supabase API endpoint and header
    const SUPABASE_URL = "https://slfpmprufyphhggbojrn.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsZnBtcHJ1ZnlwaGhnZ2JvanJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzOTI3NjEsImV4cCI6MjA1OTk2ODc2MX0.32FNAUtNcyPyP5m048Lhp2Sq6HK1zXakXFm1uraK_rA";
    
    // Use plain fetch API instead of Supabase client to avoid RLS issues
    const response = await fetch(`${SUPABASE_URL}/rest/v1/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        name,
        mobile,
        email,
        message
      })
    });
    
    // Reset button state
    submitButton.textContent = originalButtonText;
    submitButton.disabled = false;
    
    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Unknown error occurred');
    }
    
    // Show success message
    formResponse.textContent = "Thank you for reaching out! Your message has been sent.";
    formResponse.className = "success-message";
    formResponse.style.display = "block";
    
    // Clear the form after successful submission
    document.getElementById("contactForm").reset();
    
  } catch (err) {
    console.error("Error submitting form:", err);
    formResponse.textContent = "An error occurred. Please try again later. " + (err.message || '');
    formResponse.className = "error-message";
    formResponse.style.display = "block";
  }
});

// Optional: Add input validation on blur for better user experience
document.getElementById("name").addEventListener("blur", function() {
  if (this.value && !validateName(this.value)) {
    this.style.borderColor = "#dc3545";
  } else {
    this.style.borderColor = "";
  }
});

document.getElementById("mobile").addEventListener("blur", function() {
  if (this.value && !validateMobile(this.value)) {
    this.style.borderColor = "#dc3545";
  } else {
    this.style.borderColor = "";
  }
});

document.getElementById("email").addEventListener("blur", function() {
  if (this.value && !validateEmail(this.value)) {
    this.style.borderColor = "#dc3545";
  } else {
    this.style.borderColor = "";
  }
});

document.getElementById("message").addEventListener("blur", function() {
  if (this.value && !validateMessage(this.value)) {
    this.style.borderColor = "#dc3545";
  } else {
    this.style.borderColor = "";
  }
});