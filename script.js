// Dark/Light Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  body.classList.add('light-mode');
  themeToggle.textContent = '☀️';
} else {
  themeToggle.textContent = '🌙';
}

themeToggle.addEventListener('click', () => {
  body.classList.toggle('light-mode');
  const isLight = body.classList.contains('light-mode');
  themeToggle.textContent = isLight ? '☀️' : '🌙';
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// Typing Animation
const typingText = document.getElementById("typing-text");
const phrases = [
  "Web Developer",
  "ML Enthusiast",
  "Tech Explorer"
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentPhrase = phrases[phraseIndex];
  const currentText = currentPhrase.substring(0, charIndex);

  typingText.textContent = currentText;

  if (!isDeleting && charIndex < currentPhrase.length) {
    charIndex++;
    setTimeout(typeEffect, 100);
  } else if (isDeleting && charIndex > 0) {
    charIndex--;
    setTimeout(typeEffect, 50);
  } else {
    isDeleting = !isDeleting;
    if (!isDeleting) {
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
    setTimeout(typeEffect, 1000);
  }
}

typeEffect();

//submission form
const form = document.querySelector(".contact-form");
const status = document.getElementById("form-status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const response = await fetch(form.action, {
    method: form.method,
    body: formData,
    headers: {
      Accept: "application/json",
    },
  });

  if (response.ok) {
    status.textContent = "Thanks! Your message has been sent. ✅";
    status.style.color = "var(--accent)";
    form.reset();
  } else {
    status.textContent = "Oops! Something went wrong. ❌";
    status.style.color = "red";
  }
});

// Hamburger Toggle for Mobile
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Close mobile menu when a nav link is clicked
navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

// ==========================================
// Visitor Counter Logic
// ==========================================
async function updateVisitorCount() {
  // We use a unique namespace so it only tracks your portfolio
  const namespace = 'shabbir-portfolio-2025'; 
  const key = 'visits';
  
  try {
    // The '/up' endpoint increments the count and returns the new total
    const response = await fetch(`https://api.counterapi.dev/v1/${namespace}/${key}/up`);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    
    // Update the HTML span with the new count
    document.getElementById('visit-count').textContent = data.count;
  } catch (error) {
    console.error('Error fetching visitor count:', error);
    // Fallback if the API fails
    document.getElementById('visit-count').textContent = 'Unavailable';
  }
}

// Call the function when the script loads
updateVisitorCount();

// ==========================================
// Back to Top Button Logic
// ==========================================
const backToTopBtn = document.getElementById("backToTopBtn");

// Show or hide the button based on scroll position
window.addEventListener("scroll", () => {
  // If scrolled down more than 300px, show the button
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    backToTopBtn.classList.add("show");
  } else {
    backToTopBtn.classList.remove("show");
  }
});

// Smooth scroll to top when clicked
backToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});