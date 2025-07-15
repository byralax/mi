// ===== GLOBAL VARIABLES =====
let currentTheme = "dark"
const typingIndex = 0
const typingSpeed = 100
const isTyping = false

// Typing animation texts
const typingTexts = [
  "Cybersecurity Expert",
  "Frontend Developer",
  "Graphic Designer",
  "Digital Marketer",
  "Problem Solver",
]

// ===== DOM ELEMENTS =====
const nav = document.getElementById("nav")
const navToggle = document.getElementById("nav-toggle")
const navMenu = document.getElementById("nav-menu")
const themeToggle = document.getElementById("theme-toggle")
const typingElement = document.getElementById("typing-text")
const contactForm = document.getElementById("contact-form")
const easterEggModal = document.getElementById("easter-egg-modal")
const easterEggClose = document.getElementById("easter-egg-close")

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
  initializeTheme()
  initializeNavigation()
  initializeTypingAnimation()
  initializeScrollAnimations()
  initializeSkillBars()
  initializeContactForm()
  initializeEasterEgg()
  initializeSmoothScrolling()
})

// ===== THEME MANAGEMENT =====
function initializeTheme() {
  // Check for saved theme preference or default to 'dark'
  const savedTheme = localStorage.getItem("theme") || "dark"
  setTheme(savedTheme)

  themeToggle.addEventListener("click", toggleTheme)
}

function setTheme(theme) {
  currentTheme = theme
  document.documentElement.setAttribute("data-theme", theme)
  localStorage.setItem("theme", theme)

  // Update theme toggle icon
  const themeIcon = themeToggle.querySelector(".theme-icon")
  themeIcon.textContent = theme === "dark" ? "🌙" : "☀️"
}

function toggleTheme() {
  const newTheme = currentTheme === "dark" ? "light" : "dark"
  setTheme(newTheme)
}

// ===== NAVIGATION =====
function initializeNavigation() {
  // Mobile menu toggle
  navToggle.addEventListener("click", toggleMobileMenu)

  // Close mobile menu when clicking on links
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu)
  })

  // Navbar scroll effect
  window.addEventListener("scroll", handleNavbarScroll)

  // Active link highlighting
  window.addEventListener("scroll", updateActiveNavLink)
}

function toggleMobileMenu() {
  navToggle.classList.toggle("active")
  navMenu.classList.toggle("active")
}

function closeMobileMenu() {
  navToggle.classList.remove("active")
  navMenu.classList.remove("active")
}

function handleNavbarScroll() {
  if (window.scrollY > 50) {
    nav.style.background = "rgba(10, 10, 10, 0.98)"
  } else {
    nav.style.background = "rgba(10, 10, 10, 0.95)"
  }
}

function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]")
  const navLinks = document.querySelectorAll(".nav-link")

  let currentSection = ""

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100
    const sectionHeight = section.offsetHeight

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute("id")
    }
  })

  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active")
    }
  })
}

// ===== TYPING ANIMATION =====
function initializeTypingAnimation() {
  if (!typingElement) return

  startTypingAnimation()
}

function startTypingAnimation() {
  let textIndex = 0
  let charIndex = 0
  let isDeleting = false

  function type() {
    const currentText = typingTexts[textIndex]

    if (isDeleting) {
      typingElement.textContent = currentText.substring(0, charIndex - 1)
      charIndex--
    } else {
      typingElement.textContent = currentText.substring(0, charIndex + 1)
      charIndex++
    }

    let typeSpeed = isDeleting ? 50 : 100

    if (!isDeleting && charIndex === currentText.length) {
      typeSpeed = 2000 // Pause at end
      isDeleting = true
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false
      textIndex = (textIndex + 1) % typingTexts.length
      typeSpeed = 500 // Pause before next word
    }

    setTimeout(type, typeSpeed)
  }

  type()
}

// ===== SCROLL ANIMATIONS =====
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver(handleIntersection, observerOptions)

  // Observe all sections and cards
  const elementsToAnimate = document.querySelectorAll(
    "section, .project-card, .cert-card, .blog-card",
  )

  elementsToAnimate.forEach((element) => {
    observer.observe(element)
  })
}

function handleIntersection(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"

      // Trigger skill bar animations
      if (entry.target.classList.contains("about")) {
        animateSkillBars()
      }
    }
  })
}

// ===== SKILL BARS ANIMATION =====
function initializeSkillBars() {
  // Set initial styles for skill bars
  const skillBars = document.querySelectorAll(".skill-progress")
  skillBars.forEach((bar) => {
    bar.style.width = "0%"
  })
}

function animateSkillBars() {
  const skillBars = document.querySelectorAll(".skill-progress")

  skillBars.forEach((bar, index) => {
    const targetWidth = bar.getAttribute("data-width")

    setTimeout(() => {
      bar.style.width = targetWidth
    }, index * 200)
  })
}

// ===== CONTACT FORM =====
function initializeContactForm() {
  if (!contactForm) return

  contactForm.addEventListener("submit", handleFormSubmit)

  // Real-time validation
  const inputs = contactForm.querySelectorAll(".form-input")
  inputs.forEach((input) => {
    input.addEventListener("blur", validateField)
    input.addEventListener("input", clearFieldError)
  })
}

function handleFormSubmit(e) {
  e.preventDefault()

  const formData = new FormData(contactForm)
  const data = Object.fromEntries(formData)

  // Validate all fields
  const isValid = validateForm(data)

  if (isValid) {
    // Simulate form submission
    simulateFormSubmission(data)
  }
}

function validateForm(data) {
  let isValid = true

  // Name validation
  if (!data.name || data.name.trim().length < 2) {
    showFieldError("name", "Name must be at least 2 characters long")
    isValid = false
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!data.email || !emailRegex.test(data.email)) {
    showFieldError("email", "Please enter a valid email address")
    isValid = false
  }

  // Message validation
  if (!data.message || data.message.trim().length < 10) {
    showFieldError("message", "Message must be at least 10 characters long")
    isValid = false
  }

  return isValid
}

function validateField(e) {
  const field = e.target
  const value = field.value.trim()

  switch (field.name) {
    case "name":
      if (value.length < 2) {
        showFieldError("name", "Name must be at least 2 characters long")
      }
      break
    case "email":
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        showFieldError("email", "Please enter a valid email address")
      }
      break
    case "message":
      if (value.length < 10) {
        showFieldError("message", "Message must be at least 10 characters long")
      }
      break
  }
}

function showFieldError(fieldName, message) {
  const errorElement = document.getElementById(`${fieldName}-error`)
  if (errorElement) {
    errorElement.textContent = message
  }
}

function clearFieldError(e) {
  const fieldName = e.target.name
  const errorElement = document.getElementById(`${fieldName}-error`)
  if (errorElement) {
    errorElement.textContent = ""
  }
}

function simulateFormSubmission(data) {
  const submitButton = contactForm.querySelector(".form-submit")
  const originalText = submitButton.innerHTML

  // Show loading state
  submitButton.innerHTML = "<span>$ sending...</span>"
  submitButton.disabled = true

  // Simulate API call
  setTimeout(() => {
    // Show success message
    submitButton.innerHTML = "<span>$ message_sent ✓</span>"
    submitButton.style.background = "var(--success-color)"

    // Reset form
    setTimeout(() => {
      contactForm.reset()
      submitButton.innerHTML = originalText
      submitButton.disabled = false
      submitButton.style.background = ""

      // Show success notification
      showNotification("Message sent successfully! I'll get back to you soon.", "success")
    }, 2000)
  }, 1500)
}

// ===== NOTIFICATIONS =====
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.textContent = message

  // Add styles
  Object.assign(notification.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "1rem 1.5rem",
    borderRadius: "8px",
    color: "white",
    fontWeight: "500",
    zIndex: "10001",
    transform: "translateX(100%)",
    transition: "transform 0.3s ease",
    maxWidth: "300px",
  })

  // Set background color based on type
  switch (type) {
    case "success":
      notification.style.background = "var(--success-color)"
      break
    case "error":
      notification.style.background = "var(--error-color)"
      break
    default:
      notification.style.background = "var(--accent-primary)"
  }

  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Remove after delay
  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 4000)
}

// ===== EASTER EGG =====
function initializeEasterEgg() {
  let keySequence = []
  const targetSequence = ["Control", "Shift", "KeyB"]

  document.addEventListener("keydown", (e) => {
    // Add key to sequence
    keySequence.push(e.code)

    // Keep only the last 3 keys
    if (keySequence.length > 3) {
      keySequence.shift()
    }

    // Check if sequence matches
    if (keySequence.length === 3 && keySequence.every((key, index) => key === targetSequence[index])) {
      showEasterEgg()
      keySequence = [] // Reset sequence
    }
  })

  // Close easter egg modal
  if (easterEggClose) {
    easterEggClose.addEventListener("click", hideEasterEgg)
  }

  // Close on outside click
  if (easterEggModal) {
    easterEggModal.addEventListener("click", (e) => {
      if (e.target === easterEggModal) {
        hideEasterEgg()
      }
    })
  }
}

function showEasterEgg() {
  if (easterEggModal) {
    easterEggModal.classList.add("active")
    createMatrixRain()

    // Prevent body scroll
    document.body.style.overflow = "hidden"
  }
}

function hideEasterEgg() {
  if (easterEggModal) {
    easterEggModal.classList.remove("active")

    // Restore body scroll
    document.body.style.overflow = ""

    // Clear matrix rain
    const matrixRain = document.getElementById("matrix-rain")
    if (matrixRain) {
      matrixRain.innerHTML = ""
    }
  }
}

function createMatrixRain() {
  const matrixRain = document.getElementById("matrix-rain")
  if (!matrixRain) return

  const characters = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン"
  const columns = Math.floor(matrixRain.offsetWidth / 20)

  for (let i = 0; i < columns; i++) {
    const column = document.createElement("div")
    column.style.cssText = `
      position: absolute;
      left: ${i * 20}px;
      top: -100%;
      color: #00ff88;
      font-family: monospace;
      font-size: 14px;
      animation: matrixFall ${Math.random() * 3 + 2}s linear infinite;
      animation-delay: ${Math.random() * 2}s;
    `

    // Add random characters
    for (let j = 0; j < 20; j++) {
      const char = document.createElement("div")
      char.textContent = characters[Math.floor(Math.random() * characters.length)]
      char.style.opacity = Math.random()
      column.appendChild(char)
    }

    matrixRain.appendChild(column)
  }

  // Add CSS animation if not exists
  if (!document.getElementById("matrix-animation")) {
    const style = document.createElement("style")
    style.id = "matrix-animation"
    style.textContent = `
      @keyframes matrixFall {
        to {
          transform: translateY(calc(100vh + 100px));
        }
      }
    `
    document.head.appendChild(style)
  }
}

// ===== SMOOTH SCROLLING =====
function initializeSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]')

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()

      const targetId = link.getAttribute("href").substring(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80 // Account for fixed navbar

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })

        // Close mobile menu if open
        closeMobileMenu()
      }
    })
  })
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

function throttle(func, limit) {
  let inThrottle
  return function () {
    const args = arguments
    
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
// Optimize scroll events
window.addEventListener(
  "scroll",
  throttle(() => {
    handleNavbarScroll()
    updateActiveNavLink()
  }, 16),
) // ~60fps

// Lazy load images
function initializeLazyLoading() {
  const images = document.querySelectorAll("img[data-src]")

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.removeAttribute("data-src")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => imageObserver.observe(img))
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
function initializeAccessibility() {
  // Skip to main content link
  const skipLink = document.createElement("a")
  skipLink.href = "#main"
  skipLink.textContent = "Skip to main content"
  skipLink.className = "skip-link"
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 6px;
    background: var(--accent-primary);
    color: var(--bg-primary);
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 10000;
    transition: top 0.3s;
  `

  skipLink.addEventListener("focus", () => {
    skipLink.style.top = "6px"
  })

  skipLink.addEventListener("blur", () => {
    skipLink.style.top = "-40px"
  })

  document.body.insertBefore(skipLink, document.body.firstChild)

  // Add main landmark
  const heroSection = document.querySelector(".hero")
  if (heroSection) {
    heroSection.setAttribute("role", "main")
    heroSection.id = "main"
  }

  // Announce theme changes to screen readers
  themeToggle.addEventListener("click", () => {
    const announcement = document.createElement("div")
    announcement.setAttribute("aria-live", "polite")
    announcement.setAttribute("aria-atomic", "true")
    announcement.className = "sr-only"
    announcement.textContent = `Theme changed to ${currentTheme === "dark" ? "light" : "dark"} mode`

    document.body.appendChild(announcement)

    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  })
}

// Initialize accessibility features
document.addEventListener("DOMContentLoaded", initializeAccessibility)

// ===== ERROR HANDLING =====
window.addEventListener("error", (e) => {
  console.error("JavaScript error:", e.error)
  // Could send error to analytics service here
})

window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled promise rejection:", e.reason)
  // Could send error to analytics service here
})

// ===== ANALYTICS (Placeholder) =====
function trackEvent(eventName, properties = {}) {
  // Placeholder for analytics tracking
  console.log("Event tracked:", eventName, properties)

  // Example: Google Analytics 4
  // gtag('event', eventName, properties);

  // Example: Custom analytics
  // analytics.track(eventName, properties);
}

// Track important interactions
document.addEventListener("DOMContentLoaded", () => {
  // Track theme changes
  themeToggle.addEventListener("click", () => {
    trackEvent("theme_toggle", { theme: currentTheme === "dark" ? "light" : "dark" })
  })

  // Track form submissions
  if (contactForm) {
    contactForm.addEventListener("submit", () => {
      trackEvent("contact_form_submit")
    })
  }

  // Track easter egg discovery
  document.addEventListener("keydown", (e) => {
    if (e.code === "KeyB" && e.ctrlKey && e.shiftKey) {
      trackEvent("easter_egg_discovered")
    }
  })
})
