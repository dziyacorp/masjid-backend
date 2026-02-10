TUTORIAL LENGKAP: Railway + PlanetScale
Saya buatkan tutorial step-by-step:
Step 1: Prepare Code


# Di folder backend, buat file railway.json
{
  "build": {
    "builder": "npm",
    "buildCommand": "npm install"
  },
  "deploy": {
    "startCommand": "npm start"
  }
}

Step 2: Push ke GitHub

git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/masjid-backend.git
git push -u origin main

Step 3: Deploy ke Railway

    Login ke Railway
    New Project → Deploy from GitHub
    Pilih repo masjid-backend
    Railway akan auto-detect Node.js
    Tambahkan environment variables:

    DB_HOST=aws.connect.psdb.cloud
	DB_USER=xxxxx
	DB_PASSWORD=xxxxx
	DB_NAME=masjid_db
	JWT_SECRET=my-super-secret-key-123
	NODE_ENV=production

    Klik Deploy
    Tunggu 2-3 menit
    Done! URL akan muncul di dashboard

Step 4: Deploy Frontend

# Untuk frontend-admin dan frontend-public
# Push ke GitHub terpisah
# Deploy ke Netlify:
# 1. Import repo
# 2. Build settings: "echo skip"
# 3. Publish directory: "/"
# 4. Deploy

Step 5: Update API URL di Frontend

// frontend-admin/js/config.js
const API_BASE_URL = 'https://masjid-backend-production.up.railway.app/api';

// frontend-public/js/config.js
const API_BASE_URL = 'https://masjid-backend-production.up.railway.app/api';

