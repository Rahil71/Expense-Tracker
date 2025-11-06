# ExpenseTrack — Smart Expense Tracking (INR-first)

Modern expense tracker with budgets, receipt uploads, AI insights, PDF export, and clean dark UI.

## ✨ Features

* Add, edit, delete expenses with categories & notes
* *Receipt upload* to Cloudinary (modal preview + download)
* *Budgets* with progress ring (tabular numerals for aligned ₹)
* *AI analyze* (Groq) for savings insights in INR
* *PDF export* of expenses
* Email/WhatsApp alerts when monthly budget is reached
* Auth (signup/login) with JWT
* Responsive React/Tailwind UI with accessible modals & toasts

---

## 🧱 Tech Stack

*Frontend*: React (Vite), Tailwind CSS, lucide-react, Zod, custom toasts
*Backend*: Node.js, Express, Mongoose (MongoDB)
*AI*: Groq (Llama 3.3)
*Storage*: Cloudinary (receipts)
*Deploy*: Render (API) / Vercel/Netlify (web)

---

## 📁 Project Structure (suggested)


root
├─ api/                      # Node/Express backend
│  ├─ controllers/
│  ├─ middleware/
│  ├─ models/
│  ├─ routes/
│  ├─ config/                # email, whatsapp, cloudinary, groq
│  └─ server.js
└─ web/                      # React frontend (Vite)
   ├─ src/
   │  ├─ pages/              # Landing, Dashboard, Signin, Signup
   │  ├─ components/         # ProgressRing, Skeletons, ReceiptModal
   │  ├─ hooks/              # useToast, useFormValidation
   │  ├─ main.jsx
   │  └─ index.css
   ├─ index.html
   └─ tailwind.config.js


---

## ⚙ Backend Setup

### 1) Install & run

bash
cd api
npm i
npm run dev   # nodemon
# or
npm start


### 2) Environment

Create api/.env:

env
PORT=4000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>

# Cloudinary
CLOUDINARY_CLOUD_NAME=<cloud_name>
CLOUDINARY_API_KEY=<api_key>
CLOUDINARY_API_SECRET=<api_secret>

# Groq
GROQ_API_KEY=<groq_api_key>

# Email / WhatsApp (optional if you wired them)
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASS=...
WHATSAPP_API_KEY=...


### 3) API Routes (mounted under /api)

Auth:

* POST /api/auth/signup
* POST /api/auth/login

Expenses (Bearer Token required):

* GET    /api/expenses
* POST   /api/expenses  *(multipart: data JSON + receipt file)*
* PATCH  /api/expenses/:id
* DELETE /api/expenses/:id
* POST   /api/expenses/analyze
* GET    /api/expenses/exportpdf

---

## 🖥 Frontend Setup

### 1) Install & run

bash
cd web
npm i
npm run dev


### 2) Environment

Create web/.env:

env
VITE_API_BASE=https://expense-tracker-xqpr.onrender.com/api


### 3) Fonts (index.html)

html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=Space+Mono:wght@400&display=swap" rel="stylesheet">


### 4) Tailwind config (snippet)

js
// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        ui: ['Plus Jakarta Sans','Inter','system-ui','Segoe UI','Roboto','sans-serif'],
        display: ['Space Grotesk','Plus Jakarta Sans','sans-serif'],
        mono: ['Space Mono','ui-monospace','SFMono-Regular','Menlo','monospace'],
      },
    },
  },
  plugins: [],
}


### 5) Global CSS (numeric alignment)

css
/* index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #root { @apply font-ui; }
:root { font-variant-numeric: tabular-nums lining-nums; font-feature-settings:"tnum" 1,"lnum" 1; }
.tnum { font-variant-numeric: tabular-nums lining-nums; }


## 🔐 Auth Flow (Client)

* On success, token is saved to localStorage.et_token and user to localStorage.et_user.
* Guest routes (/auth/*) redirect to /dashboard if already signed in.
* Protected routes redirect to /auth/signin if token missing.

---

## 📤 File Upload (Receipt)

*Request (multipart/form-data):*

* data: *Text* field containing a JSON string
* receipt: *File* field (jpg/png/pdf)

json
// data field value (as string)
{
  "title": "Laptop bag",
  "amount": 1899,
  "category": "Office",
  "date": "2025-11-01",
  "notes": "Waterproof"
}


*Server* expects upload.single("receipt"). Uploaded file is stored in Cloudinary, URL saved as receiptURL.

*Download tip (client)*: For Cloudinary URLs, insert fl_attachment to force download:

js
url.replace('/upload/', '/upload/fl_attachment/')


---

## 🧪 Postman Collection (import JSON)

json
{
  "info": { "name": "ExpenseTrack API", "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json" },
  "variable": [
    { "key": "baseUrl", "value": "https://expense-tracker-xqpr.onrender.com/api" },
    { "key": "token", "value": "" },
    { "key": "expenseId", "value": "" }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        { "name": "Signup", "request": { "method": "POST", "header": [{ "key": "Content-Type","value": "application/json" }], "url": "{{baseUrl}}/auth/signup", "body": { "mode": "raw", "raw": "{\n  \"name\":\"Rehan\",\n  \"email\":\"rehan@example.com\",\n  \"password\":\"StrongP@ssw0rd!\",\n  \"budgetLimit\":25000,\n  \"phoneNumber\":\"+919876543210\"\n}" } } },
        { "name": "Login",  "request": { "method": "POST", "header": [{ "key": "Content-Type","value": "application/json" }], "url": "{{baseUrl}}/auth/login",  "body": { "mode": "raw", "raw": "{\n  \"email\":\"rehan@example.com\",\n  \"password\":\"StrongP@ssw0rd!\"\n}" } },
          "event": [{ "listen": "test", "script": { "exec": ["const j=pm.response.json(); if(j.token){pm.collectionVariables.set('token',j.token);}"] } }] }
      ]
    },
    {
      "name": "Expenses",
      "item": [
        { "name": "Get All", "request": { "method": "GET", "header": [{ "key": "Authorization","value": "Bearer {{token}}" }], "url": "{{baseUrl}}/expenses" } },
        { "name": "Add (JSON)", "request": { "method": "POST", "header": [{ "key": "Authorization","value": "Bearer {{token}}" }, { "key": "Content-Type","value": "application/json" }], "url": "{{baseUrl}}/expenses", "body": { "mode": "raw", "raw": "{\n  \"title\":\"Dinner\",\n  \"amount\":950,\n  \"category\":\"Food\",\n  \"date\":\"2025-11-01\",\n  \"notes\":\"Team meetup\"\n}" } },
          "event": [{ "listen": "test", "script": { "exec": ["const j=pm.response.json(); if(j.expense?._id){pm.collectionVariables.set('expenseId',j.expense._id);}"] } }] },
        { "name": "Add (multipart)", "request": { "method": "POST", "header": [{ "key": "Authorization","value": "Bearer {{token}}" }], "url": "{{baseUrl}}/expenses", "body": { "mode": "formdata", "formdata": [
          { "key": "data", "type": "text", "value": "{\n  \"title\":\"Laptop bag\",\n  \"amount\":1899,\n  \"category\":\"Office\",\n  \"date\":\"2025-11-01\",\n  \"notes\":\"Waterproof\"\n}" },
          { "key": "receipt", "type": "file", "src": [] }
        ] } } },
        { "name": "Update", "request": { "method": "PATCH", "header": [{ "key": "Authorization","value": "Bearer {{token}}" }, { "key": "Content-Type","value": "application/json" }], "url": "{{baseUrl}}/expenses/{{expenseId}}", "body": { "mode": "raw", "raw": "{\n  \"notes\":\"With client\"\n}" } } },
        { "name": "Delete", "request": { "method": "DELETE", "header": [{ "key": "Authorization","value": "Bearer {{token}}" }], "url": "{{baseUrl}}/expenses/{{expenseId}}" } },
        { "name": "Analyze (AI)", "request": { "method": "POST", "header": [{ "key": "Authorization","value": "Bearer {{token}}" }, { "key": "Content-Type","value": "application/json" }], "url": "{{baseUrl}}/expenses/analyze", "body": { "mode": "raw", "raw": "{\n  \"query\":\"Where can I cut spending next month?\"\n}" } } },
        { "name": "Export PDF", "request": { "method": "GET", "header": [{ "key": "Authorization","value": "Bearer {{token}}" }], "url": "{{baseUrl}}/expenses/exportpdf" } }
      ]
    }
  ]
}


---

## 🧵 Common Issues & Fixes

* *Zod error on sign-in (“reading forEach”)*
  Use validation.error.issues (not .errors).

* *Receipt download opens new tab*
  For Cloudinary, transform URL with /upload/fl_attachment/ or fetch→blob to force download.

* *CORS*
  If hosting frontend separately, ensure backend CORS allows your origin(s).

* *Delete route*
  Use a filtered delete: await Expense.deleteOne({ _id: req.params.id }) or findByIdAndDelete.

---

## 🚀 Deploy

* *API (Render)*: connect repo, add env vars, build: npm i, start: node server.js
* *Web (Vercel/Netlify)*: set VITE_API_BASE to your deployed API; build with npm run build

---

## 📜 License

MIT — do whatever you want; attribution appreciated.