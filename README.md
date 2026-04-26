# Crystal Drops

Web app for managing an RO water plant business — orders from QR / phone / WhatsApp / walk-in, customer database, inventory, revenue, and delivery routes.

Light & airy theme, mobile-first customer order page with **EN / हिंदी** toggle, fully responsive.

## Pages

| URL              | Page                   | Audience          |
|------------------|------------------------|-------------------|
| `/`              | Hub (landing page)     | Anyone            |
| `/admin`         | Admin dashboard        | Owner / staff     |
| `/order`         | Customer order page    | Customers (QR)    |
| `/themes`        | Theme picker           | Owner             |
| `/backgrounds`   | Background picker      | Owner             |

`cleanUrls` is on, so `.html` extensions are optional.

## Tech

- 100% static HTML/CSS/JS — no build step, no backend.
- Single shared bottom navigation bar (`bottombar.js`) — mobile only, hidden on desktop.
- Charts via [Chart.js](https://www.chartjs.org/) (CDN).
- Hosting: Firebase Hosting.
- Theme & background customisation via `localStorage`.

## Local preview

```bash
# Any static server works — example with Python:
python -m http.server 8000
# then open http://localhost:8000
```

## Deploy to Firebase

### One-time setup

1. Install [Node.js](https://nodejs.org).
2. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
3. Log in:
   ```bash
   firebase login
   ```
4. Create a Firebase project at https://console.firebase.google.com → **Add project**.
5. Open `.firebaserc` and replace `YOUR_PROJECT_ID` with your project's actual ID.

### Deploy

```bash
firebase deploy --only hosting
```

Firebase prints a URL like `https://YOUR_PROJECT_ID.web.app` — open it on your phone.

## Auto-deploy from GitHub (CI/CD)

This repo includes a GitHub Actions workflow that auto-deploys to Firebase on every push to `main`.

### Setup

1. Push the repo to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   gh repo create crystal-drops --public --source=. --push
   # or: git remote add origin <repo-url> && git push -u origin main
   ```
2. Generate a Firebase service-account token and add it as a repo secret:
   ```bash
   firebase init hosting:github
   ```
   The CLI walks you through it and adds `FIREBASE_SERVICE_ACCOUNT_<PROJECT_ID>` to GitHub Secrets automatically.
3. From now on, every `git push` to `main` triggers a deploy. Pull requests get a preview URL.

## File structure

```
.
├── index.html            # Hub (landing)
├── admin.html            # Admin dashboard
├── order.html            # Customer order page (QR target)
├── themes.html           # Theme picker
├── backgrounds.html      # Background picker
├── bottombar.js          # Shared mobile navigation
├── firebase.json         # Firebase Hosting config
├── .firebaserc           # Project ID (gitignored values)
├── .github/workflows/    # CI/CD
└── README.md
```

## License

Private project — © Anand Singh.
