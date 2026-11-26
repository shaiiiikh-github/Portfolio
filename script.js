/**
 * Shabbir's Portfolio - Native iOS 18 / visionOS Interaction Engine
 * Features:
 * - Theme management (prefers-color-scheme + localStorage)
 * - Accessibility-first typing animation
 * - Robust contact form submission with iOS Toast & haptic feedback
 * - Segmented project filtering
 * - App-Store-style interactive modal sheets with swipe-to-dismiss & keyboard trap
 * - IntersectionObserver-driven scroll-spy for desktop nav & mobile tab bar
 * - Session-cached visitor counter (increments strictly once per browser session)
 * - Fluid back-to-top & desktop card tilt
 */

document.addEventListener("DOMContentLoaded", () => {
  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Global indicator state
  let isHoveringNav = false;
  let activeSectionId = "hero";
  let indicatorInitialized = false;

  // ==========================================================================
  // 1. THEME MANAGEMENT
  // ==========================================================================
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;
  const darkThemeColor = "#000000";
  const lightThemeColor = "#F2F2F7";

  function applyTheme(theme) {
    const isLight = theme === "light";
    body.classList.toggle("light-mode", isLight);

    // Update theme-color meta tag for Safari header
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", isLight ? lightThemeColor : darkThemeColor);
    }

    // Recalculate nav indicator on theme change if initialized
    if (indicatorInitialized && typeof syncNavIndicator === "function") {
      syncNavIndicator(false);
    }
  }

  // Determine initial theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    applyTheme(prefersLight ? "light" : "dark");
  }

  // Listen for system theme changes if user hasn't explicitly set preference
  window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      applyTheme(e.matches ? "light" : "dark");
    }
  });

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const willBeLight = !body.classList.contains("light-mode");
      const nextTheme = willBeLight ? "light" : "dark";
      applyTheme(nextTheme);
      localStorage.setItem("theme", nextTheme);
    });
  }

  // ==========================================================================
  // 2. TYPING ANIMATION (ACCESSIBLE & REDUCED-MOTION RESPECTING)
  // ==========================================================================
  const typingText = document.getElementById("typing-text");
  const phrases = [
    "Full-Stack Web Developer",
    "Machine Learning Enthusiast",
    "Creative Problem Solver",
    "Tech Explorer"
  ];

  if (typingText) {
    if (prefersReducedMotion) {
      typingText.textContent = "Web Developer & ML Enthusiast";
    } else {
      let phraseIndex = 0;
      let charIndex = 0;
      let isDeleting = false;

      function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        const currentText = currentPhrase.substring(0, charIndex);
        typingText.textContent = currentText;

        if (!isDeleting && charIndex < currentPhrase.length) {
          charIndex++;
          setTimeout(typeEffect, 90);
        } else if (isDeleting && charIndex > 0) {
          charIndex--;
          setTimeout(typeEffect, 45);
        } else {
          isDeleting = !isDeleting;
          if (!isDeleting) {
            phraseIndex = (phraseIndex + 1) % phrases.length;
          }
          setTimeout(typeEffect, isDeleting ? 1400 : 400);
        }
      }
      typeEffect();
    }
  }

  // ==========================================================================
  // 3. CONTACT FORM & iOS TOAST NOTIFICATION
  // ==========================================================================
  const contactForm = document.querySelector(".contact-form");
  const formStatus = document.getElementById("form-status");
  const toast = document.getElementById("ios-toast");
  const toastMessage = document.getElementById("toast-message");
  let toastTimer = null;

  function showToast(message, type = "success") {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.className = `ios-toast glass show ${type}`;
    toast.setAttribute("aria-hidden", "false");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
      toast.setAttribute("aria-hidden", "true");
    }, 4000);
  }

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector(".btn-submit");

      // Validate inputs
      const nameInput = contactForm.querySelector("#contact-name");
      const emailInput = contactForm.querySelector("#contact-email");
      const messageInput = contactForm.querySelector("#contact-message");

      if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
        showToast("Please fill in all fields.", "error");
        return;
      }

      try {
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.classList.add("loading");
        }
        if (formStatus) formStatus.textContent = "";

        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: contactForm.method || "POST",
          body: formData,
          headers: { Accept: "application/json" }
        });

        if (response.ok) {
          showToast("Thanks! Your message has been sent. ✅", "success");
          if (formStatus) formStatus.textContent = "Message sent successfully!";
          contactForm.reset();
        } else {
          throw new Error("Server returned error");
        }
      } catch (error) {
        console.error("Formspree submission error:", error);
        showToast("Oops! Could not send message. Please try again. ❌", "error");
        if (formStatus) formStatus.textContent = "Could not send message. Try again later.";
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove("loading");
        }
      }
    });
  }

  // ==========================================================================
  // 4. SEGMENTED CONTROL PROJECT FILTER
  // ==========================================================================
  const segButtons = document.querySelectorAll(".seg-btn");
  const projectCards = document.querySelectorAll(".project-card");

  segButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      segButtons.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      const filter = btn.dataset.filter;
      projectCards.forEach((card) => {
        const categories = (card.dataset.category || "").split(" ");
        if (filter === "all" || categories.includes(filter)) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  // ==========================================================================
  // 5. iOS-STYLE PROJECT DETAIL SHEET / MODAL
  // ==========================================================================
  const sheet = document.getElementById("project-sheet");
  const sheetCloseBtn = document.getElementById("sheet-close-btn");
  const sheetTitle = document.getElementById("sheet-title");
  const sheetDesc = document.getElementById("sheet-desc");
  const sheetTags = document.getElementById("sheet-tags");
  const sheetImg = document.getElementById("sheet-img");
  const sheetSourceWebp = document.getElementById("sheet-source-webp");
  const sheetActionLink = document.getElementById("sheet-action-link");
  let lastActiveElement = null;

  function openSheet(card) {
    if (!sheet) return;
    lastActiveElement = card;

    const title = card.dataset.title || "";
    const imgWebp = card.dataset.imgWebp || "";
    const imgFallback = card.dataset.imgFallback || "";
    const tags = (card.dataset.tags || "").split(",").filter(Boolean);
    const link = card.dataset.link || "#";
    const btnText = card.dataset.btnText || "Open Project";
    const desc = card.querySelector(".project-desc")?.textContent || "";

    if (sheetTitle) sheetTitle.textContent = title;
    if (sheetDesc) sheetDesc.textContent = desc;
    if (sheetImg) {
      sheetImg.src = imgFallback;
      sheetImg.alt = `${title} preview`;
    }
    if (sheetSourceWebp) sheetSourceWebp.srcset = imgWebp;
    if (sheetActionLink) {
      sheetActionLink.href = link;
      sheetActionLink.textContent = `${btnText} →`;
    }

    if (sheetTags) {
      sheetTags.innerHTML = "";
      tags.forEach((t) => {
        const chip = document.createElement("span");
        chip.className = "chip";
        chip.textContent = t.trim();
        sheetTags.appendChild(chip);
      });
    }

    sheet.classList.add("open");
    sheet.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // Focus close button for keyboard navigation
    if (sheetCloseBtn) sheetCloseBtn.focus();
  }

  function closeSheet() {
    if (!sheet || !sheet.classList.contains("open")) return;
    sheet.classList.remove("open");
    sheet.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (lastActiveElement && typeof lastActiveElement.focus === "function") {
      lastActiveElement.focus();
    }
  }

  // Open on card click (excluding direct link click)
  projectCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".view-btn")) {
        return; // Allow normal link click
      }
      openSheet(card);
    });

    // Keyboard trigger (Enter / Space)
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        if (!e.target.closest(".view-btn")) {
          e.preventDefault();
          openSheet(card);
        }
      }
    });
  });

  if (sheetCloseBtn) {
    sheetCloseBtn.addEventListener("click", closeSheet);
  }

  // Outside click to dismiss
  if (sheet) {
    sheet.addEventListener("click", (e) => {
      if (e.target === sheet) {
        closeSheet();
      }
    });
  }

  // Escape key to dismiss
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeSheet();
    }
  });

  // Swipe-down gesture to dismiss sheet on touch devices
  let touchStartY = 0;
  let touchCurrentY = 0;
  const sheetContainer = document.querySelector(".sheet-container");

  if (sheetContainer) {
    sheetContainer.addEventListener(
      "touchstart",
      (e) => {
        touchStartY = e.touches[0].clientY;
      },
      { passive: true }
    );

    sheetContainer.addEventListener(
      "touchmove",
      (e) => {
        touchCurrentY = e.touches[0].clientY;
        const diff = touchCurrentY - touchStartY;
        // Only pull down if scrolled to top of sheet body
        const sheetBody = document.querySelector(".sheet-body");
        if (sheetBody && sheetBody.scrollTop <= 0 && diff > 0) {
          sheetContainer.style.transform = `translateY(${diff * 0.75}px)`;
        }
      },
      { passive: true }
    );

    sheetContainer.addEventListener("touchend", () => {
      const diff = touchCurrentY - touchStartY;
      sheetContainer.style.transform = "";
      if (diff > 120) {
        closeSheet();
      }
      touchStartY = 0;
      touchCurrentY = 0;
    });
  }

  // ==========================================================================
  // 6. DESKTOP SLIDING HIGHLIGHT PILL & SCROLL-SPY NAVIGATION
  // ==========================================================================
  const desktopNav = document.querySelector(".desktop-nav");
  const navLinks = document.getElementById("nav-links");
  const navIndicator = document.getElementById("nav-indicator");
  const desktopNavItems = document.querySelectorAll(".desktop-nav .nav-item");
  const mobileTabItems = document.querySelectorAll(".mobile-tab-bar .tab-item");
  const sections = Array.from(document.querySelectorAll("section[id]"));

  const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function moveIndicatorToElement(targetEl, animate = true) {
    if (!navIndicator || !navLinks || !targetEl) return;

    // Requirement 1: Compute relative to the nav's <ul> container using getBoundingClientRect()
    const ulRect = navLinks.getBoundingClientRect();
    const itemRect = targetEl.getBoundingClientRect();

    const x = Math.round(itemRect.left - ulRect.left);
    const y = Math.round(itemRect.top - ulRect.top);
    const width = Math.round(itemRect.width);
    const height = Math.round(itemRect.height);

    if (!animate || prefersReducedMotion) {
      navIndicator.style.transition = "none";
      navIndicator.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      navIndicator.style.width = `${width}px`;
      navIndicator.style.height = `${height}px`;
      navIndicator.style.opacity = "1";
      // Force reflow
      void navIndicator.offsetHeight;
      if (!prefersReducedMotion) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            navIndicator.style.transition = "";
          });
        });
      }
    } else {
      navIndicator.style.transition = "";
      navIndicator.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      navIndicator.style.width = `${width}px`;
      navIndicator.style.height = `${height}px`;
      navIndicator.style.opacity = "1";
    }
  }

  function getActiveNavItem() {
    return (
      document.querySelector(`.desktop-nav .nav-item[data-section="${activeSectionId}"]`) ||
      document.querySelector(".desktop-nav .nav-item.active") ||
      desktopNavItems[0]
    );
  }

  function syncNavIndicator(animate = true) {
    if (window.innerWidth < 768) return;
    if (!isHoveringNav) {
      const activeEl = getActiveNavItem();
      if (activeEl) {
        moveIndicatorToElement(activeEl, animate);
      }
    }
  }

  function setActiveNav(sectionId) {
    if (!sectionId) return;
    activeSectionId = sectionId;

    desktopNavItems.forEach((item) => {
      const isActive = item.dataset.section === sectionId;
      item.classList.toggle("active", isActive);
      if (isActive) {
        item.setAttribute("aria-current", "page");
      } else {
        item.removeAttribute("aria-current");
      }
    });

    mobileTabItems.forEach((tab) => {
      const isActive = tab.dataset.section === sectionId;
      tab.classList.toggle("active", isActive);
      if (isActive) {
        tab.setAttribute("aria-current", "page");
      } else {
        tab.removeAttribute("aria-current");
      }
    });

    if (!isHoveringNav) {
      syncNavIndicator(indicatorInitialized);
    }
  }

  // Requirement 3: On first load, place the pill on the active item with NO transition,
  // then enable transition on the next frame. Wait for document.fonts.ready before measuring.
  async function initDesktopNav() {
    if (window.innerWidth < 768) return;

    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    const activeEl = getActiveNavItem();
    if (activeEl) {
      moveIndicatorToElement(activeEl, false);
    }
    indicatorInitialized = true;
  }

  initDesktopNav();

  // Requirement 4, 7 & 8: Mouse hover and keyboard focus-visible tracking
  if (isFinePointer && desktopNav && navLinks) {
    desktopNavItems.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        isHoveringNav = true;
        moveIndicatorToElement(item, true);
      });

      item.addEventListener("focus", () => {
        isHoveringNav = true;
        moveIndicatorToElement(item, true);
      });
    });

    desktopNav.addEventListener("mouseleave", () => {
      isHoveringNav = false;
      const activeEl = getActiveNavItem();
      if (activeEl) {
        moveIndicatorToElement(activeEl, true);
      }
    });

    desktopNav.addEventListener("focusout", (e) => {
      if (!desktopNav.contains(e.relatedTarget)) {
        isHoveringNav = false;
        const activeEl = getActiveNavItem();
        if (activeEl) {
          moveIndicatorToElement(activeEl, true);
        }
      }
    });
  }

  // Requirement 5: Recalculate on window resize (ResizeObserver on nav) and theme change
  if (window.ResizeObserver && desktopNav) {
    const ro = new ResizeObserver(() => {
      if (window.innerWidth >= 768 && indicatorInitialized) {
        const target = isHoveringNav
          ? document.querySelector(".desktop-nav .nav-item:hover") || getActiveNavItem()
          : getActiveNavItem();
        moveIndicatorToElement(target, false);
      }
    });
    ro.observe(desktopNav);
  }

  window.addEventListener(
    "resize",
    () => {
      if (window.innerWidth >= 768 && indicatorInitialized) {
        const target = isHoveringNav
          ? document.querySelector(".desktop-nav .nav-item:hover") || getActiveNavItem()
          : getActiveNavItem();
        moveIndicatorToElement(target, false);
      }
    },
    { passive: true }
  );

  // Requirement 6: Stable Scroll-Spy with sensible rootMargin and top/bottom boundary handling
  function checkScrollBoundaries() {
    const scrollY = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    // At top of page: lock Home
    if (scrollY < 80) {
      setActiveNav("hero");
      return true;
    }

    // At bottom of page: lock Contact
    if (scrollY + windowHeight >= docHeight - 40) {
      setActiveNav("contact");
      return true;
    }

    return false;
  }

  window.addEventListener("scroll", checkScrollBoundaries, { passive: true });

  const observerOptions = {
    root: null,
    rootMargin: "-45% 0px -50% 0px",
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    if (checkScrollBoundaries()) return;

    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveNav(entry.target.id);
      }
    });
  }, observerOptions);

  sections.forEach((sec) => navObserver.observe(sec));

  // ==========================================================================
  // 7. PURE VISITOR COUNTER
  // ==========================================================================
  const visitSpan = document.getElementById("visit-count");

  async function updateVisitorCount() {
    if (!visitSpan) return;
    try {
      // Live badge hit counter (no session gating, no hardcoded fallbacks)
      const res = await fetch("https://api.visitorbadge.io/api/visitors?path=shaiiiikh-github.portfolio");
      if (!res.ok) throw new Error("Badge request failed");
      const svg = await res.text();
      // Match count from SVG aria-label or last text tag
      const ariaMatch = svg.match(/VISITORS:\s*([0-9,]+)/i);
      if (ariaMatch && ariaMatch[1]) {
        visitSpan.textContent = ariaMatch[1];
        return;
      }
      const textMatches = svg.match(/<text[^>]*>([0-9,]+)<\/text>/gi);
      if (textMatches && textMatches.length > 0) {
        const lastText = textMatches[textMatches.length - 1].replace(/<[^>]+>/g, "").trim();
        visitSpan.textContent = lastText;
        return;
      }
      throw new Error("Unable to parse visitor count");
    } catch (e) {
      visitSpan.textContent = "Unavailable";
    }
  }

  updateVisitorCount();

  // ==========================================================================
  // 8. LIVE SPOTIFY NOW PLAYING STATUS WIDGET (LANYARD INTEGRATION)
  // ==========================================================================
  // NOTE: Discord User ID must remain a STRING (18-19 digits exceeds Number.MAX_SAFE_INTEGER)
  const DISCORD_USER_ID = "649937993968254989";

  const spotifyWidget = document.getElementById("spotify-widget");
  const spotifyTitle = document.getElementById("spotify-title");
  const spotifyArtist = document.getElementById("spotify-artist");
  const spotifyArt = document.getElementById("spotify-art");
  const spotifyStatusLabel = document.getElementById("spotify-status-label");

  let spotifyPollTimer = null;
  let spotifyAbortController = null;
  let isSpotifyUpdating = false;

  // Helper to format artists string cleanly (replace ";" or multiple names with ", ")
  function formatArtists(artistStr) {
    if (!artistStr) return "Unknown Artist";
    return artistStr.split(";").map((a) => a.trim()).filter(Boolean).join(", ");
  }

  // State: Loading
  function renderSpotifyLoading() {
    if (!spotifyWidget) return;
    spotifyWidget.classList.remove("playing");
    if (spotifyStatusLabel) spotifyStatusLabel.textContent = "Connecting to Spotify...";
  }

  // State: Not Listening
  function renderSpotifyNotListening() {
    if (!spotifyWidget) return;
    spotifyWidget.classList.remove("playing");
    if (spotifyStatusLabel) spotifyStatusLabel.textContent = "Not listening to anything right now";
    if (spotifyTitle) {
      spotifyTitle.textContent = "Not Playing";
      spotifyTitle.href = "https://open.spotify.com";
      spotifyTitle.removeAttribute("title");
    }
    if (spotifyArtist) {
      spotifyArtist.textContent = "Spotify Idle";
    }
    if (spotifyArt) {
      spotifyArt.src = "assets/favicon.png";
      spotifyArt.alt = "Spotify Idle";
    }
  }

  // State: Error
  function renderSpotifyError() {
    if (!spotifyWidget) return;
    spotifyWidget.classList.remove("playing");
    if (spotifyStatusLabel) spotifyStatusLabel.textContent = "Spotify status unavailable";
    if (spotifyTitle) {
      spotifyTitle.textContent = "Offline";
      spotifyTitle.href = "https://open.spotify.com";
      spotifyTitle.removeAttribute("title");
    }
    if (spotifyArtist) {
      spotifyArtist.textContent = "Presence Offline";
    }
    if (spotifyArt) {
      spotifyArt.src = "assets/favicon.png";
      spotifyArt.alt = "Spotify Offline";
    }
  }

  // State: Listening / Now Playing
  function renderSpotifyPlaying(spot) {
    if (!spotifyWidget || !spot) return;
    spotifyWidget.classList.add("playing");
    if (spotifyStatusLabel) spotifyStatusLabel.textContent = "Listening on Spotify";

    const songTitle = spot.song || "Unknown Track";
    const artists = formatArtists(spot.artist);
    const trackUrl = spot.track_id
      ? `https://open.spotify.com/track/${spot.track_id}`
      : "https://open.spotify.com";

    if (spotifyTitle) {
      spotifyTitle.textContent = songTitle;
      spotifyTitle.href = trackUrl;
      spotifyTitle.setAttribute("title", songTitle);
    }
    if (spotifyArtist) {
      spotifyArtist.textContent = artists;
    }
    if (spotifyArt) {
      spotifyArt.src = spot.album_art_url || "assets/favicon.png";
      spotifyArt.alt = `${songTitle} album art`;
    }
  }

  async function updateSpotifyPresence() {
    if (!spotifyWidget || isSpotifyUpdating) return;
    if (document.hidden) return; // Do not poll while document.hidden is true

    if (typeof DISCORD_USER_ID !== "string" || !DISCORD_USER_ID.trim()) {
      renderSpotifyError();
      return;
    }

    if (spotifyAbortController) {
      spotifyAbortController.abort();
    }
    spotifyAbortController = new AbortController();
    const timeoutId = setTimeout(() => spotifyAbortController.abort(), 8000); // 8s timeout

    isSpotifyUpdating = true;
    try {
      const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`, {
        signal: spotifyAbortController.signal,
        headers: { "Accept": "application/json" }
      });
      clearTimeout(timeoutId);

      if (res.status === 204) {
        renderSpotifyNotListening();
        return;
      }
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();

      // Explicit check: only read data.spotify when success === true and listening_to_spotify === true
      if (json.success && json.data && json.data.listening_to_spotify === true && json.data.spotify) {
        renderSpotifyPlaying(json.data.spotify);
      } else {
        renderSpotifyNotListening();
      }
    } catch (e) {
      clearTimeout(timeoutId);
      if (e.name !== "AbortError") {
        renderSpotifyError();
      }
    } finally {
      isSpotifyUpdating = false;
    }
  }

  function startSpotifyPolling() {
    stopSpotifyPolling();
    updateSpotifyPresence();
    spotifyPollTimer = setInterval(updateSpotifyPresence, 20000); // Poll every 20s
  }

  function stopSpotifyPolling() {
    if (spotifyPollTimer) {
      clearInterval(spotifyPollTimer);
      spotifyPollTimer = null;
    }
    if (spotifyAbortController) {
      spotifyAbortController.abort();
      spotifyAbortController = null;
    }
  }

  // Lifecycle listeners: single timer, paused while tab is hidden
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopSpotifyPolling();
    } else {
      startSpotifyPolling();
    }
  });

  renderSpotifyLoading();
  startSpotifyPolling();

  // ==========================================================================
  // 8. BACK TO TOP BUTTON
  // ==========================================================================
  const backToTopBtn = document.getElementById("backToTopBtn");
  if (backToTopBtn) {
    window.addEventListener(
      "scroll",
      () => {
        if (window.scrollY > 300) {
          backToTopBtn.classList.add("show");
        } else {
          backToTopBtn.classList.remove("show");
        }
      },
      { passive: true }
    );

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ==========================================================================
  // 9. POINTER TILT ON DESKTOP PROFILE CARD
  // ==========================================================================
  const profileCard = document.getElementById("profile-card");
  if (profileCard && window.matchMedia("(hover: hover) and (pointer: fine)").matches && !prefersReducedMotion) {
    profileCard.addEventListener("mousemove", (e) => {
      const rect = profileCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const tiltX = (y / (rect.height / 2)) * -10;
      const tiltY = (x / (rect.width / 2)) * 10;
      profileCard.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
    });

    profileCard.addEventListener("mouseleave", () => {
      profileCard.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
    });
  }
});
