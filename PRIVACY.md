# Privacy Policy - Foryo Formix

*Last Updated: June 13, 2026*

Foryo Formix is a premium form operations platform built within the Foryo ecosystem. This privacy policy explains how our application integrates with Google APIs, what data we collect, how we process it, and the controls you have over your information.

---

## 1. Information We Collect

To connect your offline form planning and parsing workflows with Google Forms, we collect and process the following information:

*   **Google Profile Data:** When you log in via Google Sign-In, we retrieve your email address, display name, and profile icon URI to identify you in your workspace.
*   **Google OAuth Credentials:** We securely store your Google OAuth access and refresh tokens. These tokens authorize our backend to perform API calls directly on your behalf.
*   **Form Configurations:** We store the configurations of forms you create in our Visual Editor, including titles, descriptions, question sheets, choice option listings, point values, and correct answer keys.
*   **Spreadsheet Uploads:** File data uploaded to the Excel/CSV parser is mapped into memory dynamically to generate questions and options for your forms. We do *not* save the raw spreadsheet files on our server.

---

## 2. Google API Services & OAuth Scopes

Foryo Formix requests authorization for the following scopes to synchronize form configurations and aggregate responses:

| OAuth Scope | Purpose |
| :--- | :--- |
| `https://www.googleapis.com/auth/forms.body` | Create new forms, append questions, set up choice listings, and specify correct answers/grading. |
| `https://www.googleapis.com/auth/forms.responses.readonly` | Retrieve submission answers and metadata to render horizontal bar graphs in the analytics dashboard. |
| `https://www.googleapis.com/auth/drive` / `drive.file` | Import existing forms owned by you, and move forms directly to your Google Drive Trash upon deletion. |
| `userinfo.email` / `userinfo.profile` | Authenticate your identity and display your workspace avatar. |

---

## 3. How We Use Your Data

We use the collected information strictly to provide and maintain the platform's core services:
*   To authenticate sessions and keep you logged into the dashboard.
*   To export visual canvases and parsed spreadsheet quizzes directly into fully functioning Google Forms.
*   To import existing Google Forms from your Drive folder.
*   To process responses and summarize statistics for your form.
*   We do **not** sell, rent, or share your account info, forms, responses, or tokens with third-party advertising networks or marketing services.

---

## 4. Data Control & Deletion Policy

We believe in giving you absolute authority over your data. Our platform supports a transparent dual-deletion model:

1.   **Remove from Platform:** This action purges local form structures, configurations, and analytics logs from the Foryo Formix database. The live Google Form remains active and untouched in your Google Drive.
2.   **Delete from Drive & Platform:** This action purges all local metadata and invokes the Google Drive API to move the associated Google Form file directly to your Google Drive Trash bin.
3.   **Revoking Google Access:** You can completely revoke Foryo Formix's access at any time from your [Google Account Security Settings](https://myaccount.google.com/permissions). Revoking access renders all stored OAuth tokens inactive.

---

## 5. Contact Us

If you have questions regarding this Privacy Policy or data processing practices, please reach out to the Foryo team at [privacy@foryo.io](mailto:privacy@foryo.io).
