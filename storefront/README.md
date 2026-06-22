# Storefront

Public client-facing ecommerce app for browsing and ordering products managed from the admin panel.

## Run

```powershell
cd storefront
Copy-Item .env.example .env
npm install
npm run dev
```

Open `http://localhost:5174`

The storefront consumes the backend public API under `http://localhost:4000/api/store`.
