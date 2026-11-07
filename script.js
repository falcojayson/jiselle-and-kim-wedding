(() => {
  const data = window.invitation;
  if (!data) return;
  const setText = (id, value) => { const node = document.getElementById(id); if (node) node.textContent = value; };
  const safeUrl = (value) => { try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) ? url.href : null; } catch { return null; } };
  const date = new Date(data.date);
  const validDate = !Number.isNaN(date.getTime());
  const fullDate = validDate ? new Intl.DateTimeFormat("en-PH", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "Asia/Manila" }).format(date) : "Date to be announced";
  setText("partnerOne", data.partnerOne); setText("partnerTwo", data.partnerTwo);
  setText("monogram", `${data.partnerOne?.[0] || "?"} & ${data.partnerTwo?.[0] || "?"}`);
  setText("footerNames", `${data.partnerOne} & ${data.partnerTwo}`);
  setText("heroDate", fullDate); setText("heroVenue", data.venueSummary);
  setText("welcomeMessage", data.welcomeMessage);
  for (const part of ["ceremony", "reception"]) {
    const item = data[part] || {};
    for (const field of ["name", "time", "address"]) setText(`${part}${field[0].toUpperCase()}${field.slice(1)}`, item[field] || "To be announced");
    const map = document.getElementById(`${part}Map`); const url = safeUrl(item.mapUrl);
    if (url) map.href = url; else map.hidden = true;
  }
  setText("dressCode", data.dressCode); setText("additionalNote", data.additionalNote);
  const deadline = new Date(`${data.rsvpDeadline}T12:00:00+08:00`);
  if (!Number.isNaN(deadline.getTime())) setText("rsvpDeadline", `Kindly reply by ${new Intl.DateTimeFormat("en-PH", { month: "long", day: "numeric", year: "numeric", timeZone: "Asia/Manila" }).format(deadline)}.`);
  const formUrl = safeUrl(data.rsvpFormUrl);
  const rsvpButton = document.getElementById("rsvpButton");
  if (formUrl) { rsvpButton.href = formUrl; rsvpButton.target = "_blank"; rsvpButton.rel = "noopener noreferrer"; rsvpButton.removeAttribute("aria-disabled"); rsvpButton.firstChild.textContent = "Send your RSVP "; document.getElementById("rsvpHelp").hidden = true; }
  else rsvpButton.addEventListener("click", event => event.preventDefault());
  document.title = `${data.partnerOne} & ${data.partnerTwo} | Wedding Invitation`;
  const calendar = document.getElementById("calendarLink");
  const end = new Date(data.calendarEnd);
  if (validDate && !Number.isNaN(end.getTime())) {
    const stamp = value => value.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const params = new URLSearchParams({ action: "TEMPLATE", text: `${data.partnerOne} & ${data.partnerTwo}'s Wedding`, dates: `${stamp(date)}/${stamp(end)}`, details: "Wedding celebration", location: data.ceremony?.address || data.venueSummary });
    calendar.href = `https://calendar.google.com/calendar/render?${params}`;
  } else calendar.hidden = true;
  const countdown = document.getElementById("countdown");
  if (validDate) {
    const days = Math.ceil((date.getTime() - Date.now()) / 86400000);
    if (days > 0) countdown.textContent = `${days} days until we say “I do.”`;
    else if (days === 0) countdown.textContent = "Today is the day!";
    else countdown.textContent = "Thank you for celebrating with us.";
  }
  document.getElementById("shareButton").addEventListener("click", async event => {
    try { await navigator.clipboard.writeText(location.href.split("#")[0]); event.currentTarget.textContent = "Link copied ✓"; }
    catch { event.currentTarget.textContent = "Copy the address from your browser"; }
  });
})();
