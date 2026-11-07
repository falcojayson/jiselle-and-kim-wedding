# Set up the RSVP Sheet

The invitation embeds a Google Apps Script form. Guests submit on the invitation page. The script saves one row per submission to a private Google Sheet.

## 1. Create the Sheet

1. Create a new Google Sheet named **Kim and Jiselle Wedding RSVPs**. Keep sharing set to **Restricted**.
2. In that Sheet, choose **Extensions → Apps Script**. This creates a script connected to the Sheet.
3. Replace the contents of `Code.gs` in the Apps Script editor with the contents of this project's `google-apps-script/Code.gs`.
4. Add a new HTML file named **RsvpForm** in Apps Script. Copy this project's `google-apps-script/RsvpForm.html` into it. Apps Script will display the file as `RsvpForm.html`.
5. Save both files. No Sheet columns need to be created manually. On the first successful RSVP, the script creates the **RSVP Responses** tab with these columns: `Submitted At`, `Guest or Family Name`, `Attendance`, `Message`, `Submission ID`.

## 2. Deploy the web app

1. In Apps Script choose **Deploy → New deployment**.
2. Select **Web app**.
3. Set **Execute as: Me** and **Who has access: Anyone**. This allows guests without Google accounts to respond while the Sheet remains private.
4. Click **Deploy** and approve the Google authorization prompts for the Sheet.
5. Copy the **Web app URL** ending in `/exec`. Do not use the test URL ending in `/dev`.
6. Open the `/exec` URL in a private browser window. You should see the RSVP form without signing in.

## 3. Connect the invitation

1. Paste the `/exec` URL into `rsvpWebAppUrl` in the project's `config.js`.
2. Upload `index.html`, `config.js`, `script.js`, and `styles.css` to the GitHub invitation repository. The `google-apps-script` folder is for your own setup; GitHub Pages does not need it.
3. Open the live invitation. Its RSVP section should show the form.
4. Submit one test response, confirm the success message, then check that the row appears in the **RSVP Responses** Sheet tab. Delete only that test row after verification.

## Notes

- The form asks for an invited guest or family name, Yes/No attendance, and an optional message. It does not ask for a guest count or dietary information. Approved seats belong in your private guest list.
- Each submission is saved as a new row. This preserves changes and duplicates for manual review; the form does not automatically replace an earlier response.
- Anyone who can access the public form can submit a response. The hidden spam field and input limits reduce accidental or simple junk submissions but cannot guarantee only invited people respond. Review names against your private guest list before counting them.
- If you edit `Code.gs` or `RsvpForm.html` after deployment, update the existing deployment to a new version in **Deploy → Manage deployments**. Otherwise the live form keeps using the old code.
- The Apps Script form is framed inside GitHub Pages. If a guest's browser blocks the embedded view, the **Open RSVP form in a new tab** link below it is available.