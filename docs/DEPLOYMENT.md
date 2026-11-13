# Deployment guide: free hosting on Vercel (beginner friendly)

The generator is a static website, so it can be hosted free of charge. You do **not** need to pay for anything.
(You get a free address like `https://doko-ina-mafita-card.vercel.app`. A custom domain such as `www.yourname.com` is optional and is **not** free: you buy it from a domain seller.)

## Part 1: Put the project on GitHub

### 1. Create a GitHub account
1. Go to https://github.com and click **Sign up**.
2. Enter your email, a password and a username, then verify your email.

### 2. Create a new repository
1. After signing in, click the **+** (top right) → **New repository**.
2. Repository name: `doko-ina-mafita-card-generator`.
3. Choose **Public** (or Private; Vercel works with both).
4. Do **not** tick "Add a README". Click **Create repository**.

### 3. Upload the project (easiest way, no commands)
1. Unzip `DOKO_INA_MAFITA_MEMBERSHIP_CARD_GENERATOR.zip` on your computer.
2. On the new repository page click **uploading an existing file**.
3. Open the unzipped folder and select **everything inside it** (the `src`, `public`, `docs`, `scripts` folders and all the files such as `package.json`, `index.html`, `vercel.json`).
   Drag them into the GitHub page. (Do not upload a `node_modules` folder; the zip does not contain one.)
4. Wait until all files are listed, write a message such as "First version", and click **Commit changes**.

> On a phone, GitHub's website cannot upload whole folders easily. Use a computer, or the free GitHub Desktop app.

(Optional, with Git installed:)
```bash
cd DOKO_INA_MAFITA_MEMBERSHIP_CARD_GENERATOR
git init
git add .
git commit -m "First version"
git branch -M main
git remote add origin https://github.com/usainiuba/doko-ina-mafita-card-generator.git
git push -u origin main
```

## Part 2: Deploy on Vercel

### 4. Create a Vercel account and connect GitHub
1. Go to https://vercel.com and click **Sign Up**.
2. Choose **Continue with GitHub** and approve the connection. Choose the free **Hobby** plan.

### 5. Import the project
1. On the Vercel dashboard click **Add New… → Project**.
2. Find `doko-ina-mafita-card-generator` in the list and click **Import**.
   (If it is not listed, click "Adjust GitHub App Permissions" and allow access to that repository.)

### 6. Build settings
Vercel normally detects everything automatically. Check that it shows:

| Setting | Value |
|---|---|
| Framework Preset | Vite |
| Install Command | `npm install` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

(These are also written in `vercel.json`, so they are applied automatically.)

### 7. Deploy
Click **Deploy**. Wait 1–2 minutes. When you see "Congratulations", the site is live.

### 8. Get your website link
Click **Continue to Dashboard**, then the **Visit** button, or copy the address under "Domains"
(for example `https://doko-ina-mafita-card-generator.vercel.app`). Share this link with members.

### 9. Test on an Android phone
1. Open the link in **Chrome** on an Android phone.
2. Fill in the form, choose a photo from the gallery, check the preview.
3. Tap **Download membership card**. Open your Gallery/Downloads and check that the PNG has the photo and all details.
4. Also try with a very long name, and a position such as "Other / Custom Position".
5. If a download does not start, use the "Your card is ready" panel: press and hold the picture and save it.

(Tell members to open the link in Chrome or Safari, not inside WhatsApp/Facebook's built-in browser, which can block downloads.)

## Part 3: Updating the website later
1. Edit the files (for example `src/config/positions.js`). On GitHub you can click the file → pencil icon → change → **Commit changes**.
2. Vercel notices the change and redeploys automatically in about a minute. The same link shows the new version.
3. If something breaks, in Vercel open **Deployments**, choose an older working one, and click **Promote to Production**.

## Part 4: Custom domain (optional, paid)
1. Buy a domain from a seller (for example Namecheap or GoDaddy). Prices vary; the domain itself is **not free**.
2. In Vercel open the project → **Settings → Domains** → **Add**, type your domain.
3. Vercel shows the DNS records to add (usually an A record `76.76.21.21` and a CNAME `cname.vercel-dns.com`; follow exactly what Vercel displays).
4. Add them at your domain seller's DNS page, wait from a few minutes up to 24 hours, and Vercel will show a green tick. HTTPS is added for free.

## Alternative: free hosting on Netlify
1. Create an account at https://www.netlify.com (you can sign in with GitHub).
2. **Add new site → Import an existing project → GitHub** → choose the repository.
3. Build command: `npm run build`   ·   Publish directory: `dist`
4. Click **Deploy**. You get a free address like `https://something.netlify.app`.
5. Single-page-app routing: create a file `public/_redirects` containing `/*  /index.html  200` before deploying (this app has only one page, so it is optional).

Quick option without GitHub: run `npm install` and `npm run build` on a computer, then drag the generated **`dist`** folder onto https://app.netlify.com/drop.

## Notes
- The project has no secrets, so no environment variables are needed.
- The site is static: no server, no database, no running costs.
