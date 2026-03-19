# Syncro-Link Deployment Guide

## Deploy to Vercel (Recommended — Free)

### Step 1: Set up Turso Database (free)
1. Go to https://turso.tech and create a free account
2. Create a new database (name it `syncro-link`)
3. Copy your **Database URL** (looks like `libsql://syncro-link-yourname.turso.io`)
4. Create an auth token: in Turso dashboard click your database → "Create Token"
5. Copy the **Auth Token**

### Step 2: Push to GitHub
```bash
cd syncro-link
git add -A
git commit -m "Initial Syncro-Link"
git remote add origin https://github.com/YOUR_USERNAME/syncro-link.git
git push -u origin main
```

### Step 3: Deploy on Vercel
1. Go to https://vercel.com and sign up free with GitHub
2. Click "Import Project" → select your `syncro-link` repo
3. In the Environment Variables section, add:
   - `TURSO_DATABASE_URL` = your Turso database URL
   - `TURSO_AUTH_TOKEN` = your Turso auth token
   - `JWT_SECRET` = any random string (e.g. run `openssl rand -hex 32`)
4. Click "Deploy"
5. Vercel will auto-detect Next.js and build it

### Step 4: Add Vercel Blob Storage
1. In Vercel dashboard → your project → Storage tab
2. Click "Create" → "Blob"
3. This auto-adds the `BLOB_READ_WRITE_TOKEN` env var

### Step 5: Run Database Migrations
After first deploy, run migrations against your Turso database:
```bash
TURSO_DATABASE_URL="libsql://..." TURSO_AUTH_TOKEN="..." npx prisma migrate deploy
```

### Step 6: You're Live!
Your app is now at `https://syncro-link-xxx.vercel.app`
You can add a custom domain in Vercel dashboard → Settings → Domains

---

## Environment Variables Reference

| Variable | Required | Where to get it |
|----------|----------|----------------|
| `TURSO_DATABASE_URL` | Yes | Turso dashboard |
| `TURSO_AUTH_TOKEN` | Yes | Turso dashboard |
| `BLOB_READ_WRITE_TOKEN` | Yes | Auto-added by Vercel Blob |
| `JWT_SECRET` | Yes | Generate: `openssl rand -hex 32` |
