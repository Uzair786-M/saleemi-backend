# SaleemiExpert Backend API

Node.js + Express + MongoDB REST API for the SaleemiExpert portfolio website.

---

## 🚀 Quick Setup

### 1. Install dependencies
```bash
cd saleemi-backend
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
```
Then open `.env` and fill in your values — especially `MONGO_URI`.

### 3. Get MongoDB URI (Free)
- Go to [mongodb.com/atlas](https://mongodb.com/atlas)
- Create a free account → Create a cluster (free tier M0)
- Click **Connect** → **Drivers** → copy the connection string
- Replace `<password>` with your DB password
- Paste into `MONGO_URI` in your `.env`

### 4. Seed the database
```bash
npm run seed
```
This creates the admin account and populates all collections with default data.

### 5. Start the server
```bash
npm run dev     # development (auto-restarts)
npm start       # production
```

Server runs on: `http://localhost:5000`

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint                    | Access | Description           |
|--------|-----------------------------|--------|-----------------------|
| POST   | /api/auth/login             | Public | Admin login           |
| GET    | /api/auth/me                | Admin  | Get current admin     |
| PUT    | /api/auth/change-password   | Admin  | Change password       |

### Services
| Method | Endpoint           | Access | Description     |
|--------|--------------------|--------|-----------------|
| GET    | /api/services      | Public | Get all services|
| GET    | /api/services/:id  | Public | Get one service |
| POST   | /api/services      | Admin  | Create service  |
| PUT    | /api/services/:id  | Admin  | Update service  |
| DELETE | /api/services/:id  | Admin  | Delete service  |

### Portfolio
| Method | Endpoint            | Access | Description      |
|--------|---------------------|--------|------------------|
| GET    | /api/portfolio      | Public | Get all projects |
| GET    | /api/portfolio/:id  | Public | Get one project  |
| POST   | /api/portfolio      | Admin  | Create project   |
| PUT    | /api/portfolio/:id  | Admin  | Update project   |
| DELETE | /api/portfolio/:id  | Admin  | Delete project   |

### Testimonials
| Method | Endpoint                | Access | Description          |
|--------|-------------------------|--------|----------------------|
| GET    | /api/testimonials       | Public | Get all testimonials |
| POST   | /api/testimonials       | Admin  | Create testimonial   |
| PUT    | /api/testimonials/:id   | Admin  | Update testimonial   |
| DELETE | /api/testimonials/:id   | Admin  | Delete testimonial   |

### Contact
| Method | Endpoint                  | Access | Description          |
|--------|---------------------------|--------|----------------------|
| POST   | /api/contact              | Public | Submit contact form  |
| GET    | /api/contact              | Admin  | Get all messages     |
| PUT    | /api/contact/:id/status   | Admin  | Update status        |
| POST   | /api/contact/:id/reply    | Admin  | Reply to message     |
| DELETE | /api/contact/:id          | Admin  | Delete message       |

### About
| Method | Endpoint    | Access | Description        |
|--------|-------------|--------|--------------------|
| GET    | /api/about  | Public | Get about content  |
| PUT    | /api/about  | Admin  | Update about page  |

### Pricing
| Method | Endpoint          | Access | Description      |
|--------|-------------------|--------|------------------|
| GET    | /api/pricing      | Public | Get all packages |
| POST   | /api/pricing      | Admin  | Create package   |
| PUT    | /api/pricing/:id  | Admin  | Update package   |
| DELETE | /api/pricing/:id  | Admin  | Delete package   |

---

## 🔗 Connecting Frontend to Backend

In your frontend `src/services/api.js`, replace the stub functions:

```js
const API = "http://localhost:5000/api"; // change to your deployed URL in production

// Get token from localStorage
const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
});

// Example — fetch services
export const fetchServices = async () => {
  const res = await fetch(`${API}/services`);
  const data = await res.json();
  return data.data;
};

// Example — login
export const loginAdmin = async (email, password) => {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  localStorage.setItem("admin_token", data.token);
  return data.user;
};

// Example — submit contact form
export const submitContactForm = async (formData) => {
  const res = await fetch(`${API}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};
```

---

## 📁 Project Structure

```
src/
├── server.js              # Entry point
├── config/
│   └── db.js              # MongoDB connection
├── models/
│   ├── Admin.model.js
│   ├── Service.model.js
│   ├── Portfolio.model.js
│   ├── Testimonial.model.js
│   ├── Contact.model.js
│   ├── About.model.js
│   └── Pricing.model.js
├── controllers/
│   ├── auth.controller.js
│   ├── services.controller.js
│   ├── portfolio.controller.js
│   ├── testimonials.controller.js
│   ├── contact.controller.js
│   ├── about.controller.js
│   └── pricing.controller.js
├── routes/
│   ├── auth.routes.js
│   ├── services.routes.js
│   ├── portfolio.routes.js
│   ├── testimonials.routes.js
│   ├── contact.routes.js
│   ├── about.routes.js
│   └── pricing.routes.js
├── middleware/
│   ├── auth.middleware.js    # JWT protection
│   ├── error.middleware.js   # Global error handler
│   └── validate.middleware.js
└── utils/
    └── seed.js               # Database seeder
```

---

## 🔒 Security Features
- JWT authentication with expiry
- Password hashing with bcrypt (12 rounds)
- Rate limiting (100 req/15min general, 10 req/15min for login)
- Helmet.js security headers
- CORS restricted to frontend URL
- Input validation on all routes

---

## 📧 Email Setup (Contact Form)
1. Go to your Google account → Security → 2-Step Verification → App passwords
2. Generate an app password for "Mail"
3. Add to `.env`: `EMAIL_USER=your@gmail.com` and `EMAIL_PASS=your_app_password`

Emails will be sent automatically when someone submits the contact form.
