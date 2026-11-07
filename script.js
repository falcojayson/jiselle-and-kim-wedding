(() => {
  const data = window.invitation;
  if (!data) return;

  const header = document.querySelector(".site-header");
  const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
  const menuToggle = document.getElementById("menuToggle");
  const siteNav = document.getElementById("siteNav");
  const closeMenu = () => {
    siteNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  };
  menuToggle.addEventListener("click", () => {
    const open = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  siteNav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });

  const loadingScreen = document.getElementById("loadingScreen");
  const preloadImage = (source) => new Promise(resolve => {
    const picture = new Image();
    const timeout = window.setTimeout(() => resolve(false), 7000);
    picture.onload = () => { window.clearTimeout(timeout); resolve(true); };
    picture.onerror = () => { window.clearTimeout(timeout); resolve(false); };
    picture.src = source;
  });
  const heroPhoto = document.getElementById("heroPhoto");
  const heroPhotoReady = new Promise(resolve => {
    if (!data.heroPhotoUrl) { resolve(false); return; }
    let settled = false;
    const finish = (loaded) => {
      if (!settled) { settled = true; resolve(loaded); }
    };
    heroPhoto.addEventListener("load", async () => {
      try { await heroPhoto.decode(); } catch { /* The image can still render. */ }
      heroPhoto.hidden = false;
      document.getElementById("photoPlaceholder").hidden = true;
      finish(true);
    }, { once: true });
    heroPhoto.addEventListener("error", () => finish(false), { once: true });
    window.setTimeout(() => finish(false), 20000);
    heroPhoto.src = data.heroPhotoUrl;
  });

  const setText = (id, value) => {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  };

  const safeUrl = (value) => {
    try {
      const url = new URL(value);
      return ["https:", "http:"].includes(url.protocol) ? url.href : null;
    } catch {
      return null;
    }
  };

  const date = new Date(data.date);
  const validDate = !Number.isNaN(date.getTime());
  const fullDate = validDate
    ? new Intl.DateTimeFormat("en-PH", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "Asia/Manila"
      }).format(date)
    : "Date to be announced";

  setText("partnerOne", data.partnerOne);
  setText("partnerTwo", data.partnerTwo);
  setText("monogram", `${data.partnerOne?.[0] || "?"} & ${data.partnerTwo?.[0] || "?"}`);
  setText("footerNames", `${data.partnerOne} & ${data.partnerTwo}`);
  setText("heroDate", fullDate);
  setText("heroVenue", data.venueSummary);
  setText("welcomeMessage", data.welcomeMessage);

  for (const part of ["ceremony", "reception"]) {
    const item = data[part] || {};
    for (const field of ["name", "time", "address"]) {
      setText(`${part}${field[0].toUpperCase()}${field.slice(1)}`, item[field] || "To be announced");
    }

    const map = document.getElementById(`${part}Map`);
    const url = safeUrl(item.mapUrl);
    if (url) map.href = url;
    else map.hidden = true;
  }

  setText("dressCode", data.dressCode);
  setText("additionalNote", data.additionalNote);

  const deadline = new Date(`${data.rsvpDeadline}T12:00:00+08:00`);
  if (!Number.isNaN(deadline.getTime())) {
    const deadlineText = new Intl.DateTimeFormat("en-PH", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "Asia/Manila"
    }).format(deadline);
    setText("rsvpDeadline", `Kindly reply by ${deadlineText}.`);
  }

  const webAppUrl = safeUrl(data.rsvpWebAppUrl);
  const rsvpFrame = document.getElementById("rsvpFrame");
  const rsvpHelp = document.getElementById("rsvpHelp");
  let rsvpReady = Promise.resolve();
  if (webAppUrl && webAppUrl.includes("script.google.com/") && webAppUrl.endsWith("/exec")) {
    document.getElementById("rsvpOpen").href = webAppUrl;
    document.getElementById("rsvpOpenWrap").hidden = false;
    rsvpReady = new Promise(resolve => {
      let settled = false;
      const complete = (loaded) => {
        if (settled) {
          if (loaded) {
            rsvpFrame.hidden = false;
            rsvpHelp.hidden = true;
          }
          return;
        }
        settled = true;
        if (loaded) {
          rsvpFrame.hidden = false;
          rsvpHelp.hidden = true;
        } else {
          rsvpHelp.textContent = "The RSVP form is taking longer to load. Please open it in a new tab below.";
        }
        resolve();
      };
      rsvpFrame.addEventListener("load", () => complete(true), { once: true });
      rsvpFrame.addEventListener("error", () => complete(false), { once: true });
      window.setTimeout(() => complete(false), 12000);
      rsvpFrame.src = webAppUrl;
    });
  } else {
    rsvpHelp.textContent = "The RSVP form will appear here once it is connected.";
  }

  document.title = `${data.partnerOne} & ${data.partnerTwo} | Wedding Invitation`;

  const calendar = document.getElementById("calendarLink");
  const end = new Date(data.calendarEnd);
  if (validDate && !Number.isNaN(end.getTime())) {
    const stamp = value => value.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: `${data.partnerOne} & ${data.partnerTwo}'s Wedding`,
      dates: `${stamp(date)}/${stamp(end)}`,
      details: "Wedding celebration",
      location: data.ceremony?.address || data.venueSummary
    });
    calendar.href = `https://calendar.google.com/calendar/render?${params}`;
    calendar.hidden = false;
  } else {
    calendar.hidden = true;
  }

  const countdown = document.getElementById("countdown");
  if (validDate) {
    const days = Math.ceil((date.getTime() - Date.now()) / 86400000);
    if (days > 0) countdown.textContent = `${days} days until we say “I do.”`;
    else if (days === 0) countdown.textContent = "Today is the day!";
    else countdown.textContent = "Thank you for celebrating with us.";
  }

  document.getElementById("shareButton").addEventListener("click", async event => {
    try {
      await navigator.clipboard.writeText(location.href.split("#")[0]);
      event.currentTarget.textContent = "Link copied ✓";
    } catch {
      event.currentTarget.textContent = "Copy the address from your browser";
    }
  });

  const music = document.getElementById("backgroundMusic");
  const musicControl = document.getElementById("musicControl");
  const updateMusicControl = () => {
    const playing = !music.paused;
    musicControl.setAttribute("aria-pressed", String(playing));
    musicControl.setAttribute("aria-label", playing ? "Pause background music" : "Play background music");
    musicControl.querySelector("span").textContent = playing ? "Pause music" : "Play music";
  };

  music.addEventListener("play", updateMusicControl);
  music.addEventListener("pause", updateMusicControl);
  musicControl.addEventListener("click", async () => {
    if (music.paused) {
      try {
        await music.play();
      } catch {
        updateMusicControl();
      }
    } else {
      music.pause();
    }
  });
  const artworkReady = Promise.all([
    preloadImage("images/satin-bow-small.png"),
    preloadImage("images/floral-invitation-card-small.jpg"),
    heroPhotoReady,
    Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise(resolve => window.setTimeout(resolve, 5000))]),
  ]);
  const intro = document.getElementById("envelopeIntro");
  const introOpen = document.getElementById("envelopeOpen");
  const introSkip = document.getElementById("introSkip");
  const pageAreas = [document.querySelector("header"), document.querySelector("main"), document.querySelector("footer"), musicControl];
  const introKey = "kim-jiselle-intro-seen";
  let introSeen = false;
  try { introSeen = sessionStorage.getItem(introKey) === "1"; } catch { /* Storage can be unavailable. */ }

  const finishIntro = (animateExit) => {
    if (intro.hidden) return;
    const close = () => {
      intro.hidden = true;
      document.body.classList.remove("intro-active");
      pageAreas.forEach(area => { if (area) area.inert = false; });
      const heading = document.querySelector(".hero h1");
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
      try { sessionStorage.setItem(introKey, "1"); } catch { /* Continue without storage. */ }
    };
    if (animateExit) {
      intro.classList.add("is-leaving");
      window.setTimeout(close, 480);
    } else close();
  };

  artworkReady.then(([bowLoaded, cardLoaded]) => {
    // Show the site directly if essential animation art is unavailable.
    if (!introSeen && bowLoaded && cardLoaded) {
      intro.hidden = false;
      document.body.classList.add("intro-active");
      pageAreas.forEach(area => { if (area) area.inert = true; });
      introOpen.focus({ preventScroll: true });
    }
    music.play().catch(updateMusicControl);
    loadingScreen.classList.add("is-ready");
    window.setTimeout(() => { loadingScreen.hidden = true; }, 350);
  });

  if (!introSeen) {
    introOpen.addEventListener("click", () => {
      if (intro.classList.contains("is-opening")) return;
      music.play().catch(updateMusicControl);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        finishIntro(false);
        return;
      }
      intro.classList.add("is-opening");
      introOpen.disabled = true;
      window.setTimeout(() => finishIntro(true), 3250);
    });
    introSkip.addEventListener("click", () => finishIntro(false));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !intro.hidden) finishIntro(false);
    });
  }
})();