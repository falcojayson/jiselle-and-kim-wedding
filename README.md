# Wedding invitation template

A free, static wedding invitation for GitHub Pages. RSVP answers go to Google Forms and its linked Google Sheet. This is a separate project from HRMIS.

## Customize

1. Open `config.js` and replace every sample name, date, venue, address, map, dress code, and note. Dates use ISO format with the Philippine offset (`+08:00`).
2. Create a Google Form with fields such as guest name, attendance, number of seats, and dietary notes. Publish it and copy its **responder** link into `rsvpFormUrl` in `config.js`.
3. In the Form's **Responses** tab, choose **Link to Sheets** to create or select your private response spreadsheet. Keep the spreadsheet private; never put its URL or credentials into this website.
4. Set `isSample: false` after checking every detail. The sample banner then disappears.
5. Preview `index.html` in a local browser. Test the map links, calendar link, and RSVP form with a sample response.

## Publish on GitHub Pages

1. Create a **new repository** for the invitation. Do not publish the HRMIS repository.
2. Put this project's files at the new repository root and push them to GitHub.
3. In repository **Settings → Pages**, choose **Deploy from a branch**, then select `main` and `/ (root)`.
4. Open the published `https://USERNAME.github.io/REPOSITORY/` URL and test it on a phone.
5. Share that URL directly or turn it into a QR code with a QR generator of your choice. The **Copy invitation link** button also copies the published URL.

GitHub Pages sites are public. Avoid private guest information on the page or in the repository. The RSVP form can collect that information separately; check its sharing settings before sending invitations.

## Files

- `index.html`: page sections and labels
- `styles.css`: responsive visual design
- `config.js`: wedding details and RSVP link
- `script.js`: content, countdown, calendar event, and share button

No package installation, paid hosting, database, or build step is required.
# jiselle-and-kim-wedding
