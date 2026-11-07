# Wedding invitation template

A free wedding invitation for GitHub Pages. An embedded Google Apps Script form saves RSVP answers in a private Google Sheet. This is a separate project from HRMIS.

## Customize

1. Replace the sample names, dates, times, and other details in `config.js`.
2. Follow `google-apps-script/SETUP.md` to create the private Sheet, deploy the RSVP script, and paste its `/exec` URL into `rsvpWebAppUrl`.
3. Preview `index.html` locally. Test the venue map links, calendar link, and RSVP on the published site.
## Publish on GitHub Pages

1. Create a **new repository** for the invitation. Do not publish the HRMIS repository.
2. Put this project's files at the new repository root and push them to GitHub.
3. In repository **Settings → Pages**, choose **Deploy from a branch**, then select `main` and `/ (root)`.
4. Open the published `https://USERNAME.github.io/REPOSITORY/` URL and test it on a phone.
5. Share that URL directly or turn it into a QR code with a QR generator of your choice. The **Copy invitation link** button also copies the published URL.

GitHub Pages sites are public. Avoid private guest information on the page or in the repository. The RSVP form can collect that information separately; check its sharing settings before sending invitations.

## Files

- `index.html`: page sections and labels
- `images/din and kim.jpg`: couple photo used in the hero
- `styles.css`: responsive visual design
- `config.js`: wedding details and RSVP link
- `script.js`: content, countdown, calendar event, and share button

No package installation, paid hosting, database, or build step is required.
# jiselle-and-kim-wedding

## Music

The included "Wedding Song.mp3" starts automatically when a browser permits sound autoplay. If autoplay is blocked, guests can use the Play music button. Keep the MP3 in the `music/` folder when uploading to GitHub. The file is about 8 MB, so it may take time to load on mobile data. Use music you have permission to share publicly.
