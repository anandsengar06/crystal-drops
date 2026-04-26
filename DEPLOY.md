# Deploy Crystal Drops

Two paths — pick the one that matches how you want to work.

## Path A — One-time deploy (manual, fastest first time)

```bash
npm install -g firebase-tools     # one-time, system-wide
firebase login                    # opens browser
# edit .firebaserc — replace YOUR_PROJECT_ID
firebase deploy --only hosting
```

You get a URL like `https://YOUR_PROJECT_ID.web.app` immediately.

## Path B — GitHub + Firebase CI/CD (recommended, like your previous projects)

This auto-deploys every time you `git push` to `main`. Set up once, then just push.

### Setup

```bash
# 1. push the repo to GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
gh repo create crystal-drops --public --source=. --push
# (or use the GitHub website + git remote add origin ...)

# 2. wire Firebase to GitHub Actions
firebase login
firebase init hosting:github
```

The `firebase init hosting:github` command walks you through:
- Selecting your Firebase project
- Authorising the GitHub Actions integration
- Adding the service-account secret to your repo automatically

It also asks if it should set up the workflow files — say **No** (we already have them in `.github/workflows/`).

### After setup

Edit `.firebaserc` and the two workflow files in `.github/workflows/` — replace every `YOUR_PROJECT_ID` with your real Firebase project ID, then commit and push:

```bash
git add .firebaserc .github
git commit -m "Wire Firebase project ID"
git push
```

Watch the Actions tab on GitHub — your site deploys in ~30 seconds.

From now on, **every push to `main` deploys automatically**. Every PR gets its own preview URL.
