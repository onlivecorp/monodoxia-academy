# Monodoxia Academy

> **Elite Personal Development & Psychological Education Ecosystem**  
> An academic, multidisciplinary web platform combining psychology, coaching methodologies, community clubs, and modern digital applications.

[![Build & Validate](https://github.com/your-username/monodoxia-academy/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/monodoxia-academy/actions/workflows/ci.yml)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Vite Version](https://img.shields.io/badge/vite-v5.4-purple.svg)](https://vitejs.dev/)
[![React Version](https://img.shields.io/badge/react-v18.3-blue.svg)](https://react.dev/)
[![PHP Version](https://img.shields.io/badge/php-%3E%3D8.0-indigo.svg)](https://www.php.net/)
[![MySQL Version](https://img.shields.io/badge/mysql-%3E%3D5.7%20%7C%208.0-orange.svg)](https://www.mysql.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Features](#2-features)
3. [Technology Stack](#3-technology-stack)
4. [Architecture Overview](#4-architecture-overview)
5. [Project Structure](#5-project-structure)
6. [Prerequisites](#6-prerequisites)
7. [Installation](#7-installation)
8. [Environment Variables](#8-environment-variables)
9. [Local Development](#9-local-development)
10. [Backend & Database Setup](#10-backend--database-setup)
11. [Third-Party Service Configuration](#11-third-party-service-configuration)
12. [Cloud & Backend Services (MySQL vs BaaS)](#12-cloud--backend-services)
13. [Build Instructions](#13-build-instructions)
14. [Production Configuration](#14-production-configuration)
15. [GitHub Setup](#15-github-setup)
16. [Deployment Instructions](#16-deployment-instructions)
    - [Hostinger (hPanel / cPanel / Apache)](#a-hostinger-deployment-recommended)
    - [Vercel / Netlify + External PHP/MySQL](#b-static-jamstack-deployment)
    - [Ubuntu / VPS (Nginx + PHP-FPM)](#c-vps-deployment-ubuntu-2204--nginx)
17. [Domain & HTTPS Configuration](#17-domain--https-configuration)
18. [CI/CD Instructions](#18-cicd-instructions)
19. [Troubleshooting](#19-troubleshooting)
20. [Security Recommendations](#20-security-recommendations)
21. [Updating & Upgrading](#21-updating--upgrading)
22. [Contribution Guidelines](#22-contribution-guidelines)
23. [License](#23-license)
24. [Contact & Project Information](#24-contact--project-information)

---

## 1. Project Overview

**Monodoxia Academy** is an integrated psychological education and personal transformation platform. It brings together academic psychological research, ancient wisdom, and modern coaching methodologies under a single digital hub.

The platform provides users with interactive course explorations, private coaching session bookings, club memberships, community forums, live events, audio-visual player modals, certificate issuance, and an administrative control panel for managing real-time student applications and curriculum settings.

---

## 2. Features

- **Luxury Academic Visual Design**: Bespoke CSS design system with royal navy, imperial gold, parchment surfaces, glassmorphic modals, and animated splash screens.
- **Centralized Multilingual Architecture (i18n)**: Seamless client-side language switching between Azerbaijani (`az`), English (`en`), Russian (`ru`), and Turkish (`tr`).
- **Application & Registration Engine**:
  - Interactive multi-step modal for course and club tier enrollments.
  - Dynamic custom form fields configurable by administrators.
  - Dual-mode data persistence: Live Hostinger MySQL API with graceful local storage fallback for offline resilience.
- **Comprehensive Administration Console**:
  - Real-time review and status updates for student enrollments (Pending, Approved, Rejected).
  - Course, event, category, and club tier CRUD operations.
  - System health monitor with live MySQL ping and latency metrics.
  - One-click database schema migration trigger.
- **Interactive Community & Media Hub**:
  - Discussion forum topics with categorization and voting.
  - Video and audio player modal with lecture transcripts.
  - Interactive certificate verification and preview modal.
- **Production-Grade Performance**:
  - Sub-second load times via Vite asset optimization.
  - Automatic vendor chunk splitting for optimal browser caching.
  - Production `.htaccess` rules for gzip compression and browser cache lifetimes.

---

## 3. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 18.3 (Hooks, Context API, Suspense-ready) |
| **Build Tooling & Bundler** | Vite 5.4 with `@vitejs/plugin-react` |
| **Styling & Design System** | Vanilla CSS (`css/design-system.css`) with CSS custom properties |
| **Icons & Typography** | Google Fonts (Playfair Display, Cormorant Garamond, Plus Jakarta Sans), Material Symbols |
| **Backend API** | PHP 8.x with PDO MySQL (JSON REST endpoints) |
| **Database** | MySQL 5.7+ / MariaDB 10.3+ (InnoDB, UTF-8 MB4) |
| **Server Engine** | Apache / LiteSpeed (Hostinger) with `mod_rewrite`, `mod_headers`, `mod_expires` |
| **CI/CD** | GitHub Actions (`.github/workflows/ci.yml`) |

---

## 4. Architecture Overview

```
┌────────────────────────────────────────────────────────┐
│               Client Browser (SPA)                     │
│  React 18  │  LanguageContext (i18n)  │  AppContext    │
└───────────┬────────────────────────────────┬───────────┘
            │                                │
      [Local State]                   [HTTP JSON API]
   (localStorage Fallback)           (Fetch /api.php)
            │                                │
            ▼                                ▼
┌───────────────────────┐        ┌───────────────────────┐
│ Browser Local Storage │        │ Hostinger PHP Backend │
│  - Offline buffer     │        │  - api.php (Router)   │
│  - Admin overrides    │        │  - db_config.php      │
└───────────────────────┘        └───────────┬───────────┘
                                             │ [PDO Prepared]
                                             ▼
                                 ┌───────────────────────┐
                                 │     MySQL Database    │
                                 │   - mdx_users         │
                                 │   - mdx_courses       │
                                 │   - mdx_applications  │
                                 │   - mdx_form_fields   │
                                 └───────────────────────┘
```

1. **Client Layer**: React Single Page Application (SPA) driven by `LanguageContext` and `AppContext`.
2. **API Layer**: `api.php` acts as a zero-dependency lightweight controller exposing endpoints for ping, status, data synchronization, applications, categories, and migrations.
3. **Database Layer**: Relational MySQL schema prefixed with `mdx_` with relational indexes and UTF8MB4 unicode support.

---

## 5. Project Structure

```
Monodoxia Academy Web/
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI workflow
├── css/
│   └── design-system.css        # Core custom design tokens, themes & layout utilities
├── public/                      # Static assets copied into dist/ upon build
│   ├── .htaccess                # Apache routing, HTTPS enforcement, and security guards
│   ├── api.php                  # Production backend API handler
│   ├── db_config.example.php    # Safe template for database credentials
│   ├── db_config.php            # Local/runtime database configuration (ignored by Git)
│   └── hostinger_monodoxia_schema.sql # Database structure & seed migrations
├── src/
│   ├── components/              # Modular UI components
│   │   ├── modals/              # Interactive dialogs (Admin, Auth, App, Player, etc.)
│   │   ├── About.jsx
│   │   ├── Academy.jsx
│   │   ├── Areas.jsx
│   │   ├── Club.jsx
│   │   ├── Coaches.jsx
│   │   ├── Community.jsx
│   │   ├── Events.jsx
│   │   ├── FAQ.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── Newsletter.jsx
│   │   ├── SafetyBanner.jsx
│   │   ├── Testimonials.jsx
│   │   └── ToastContainer.jsx
│   ├── context/
│   │   └── AppContext.jsx       # State store: apps, courses, user auth, API sync
│   ├── data/
│   │   └── mockData.js          # Baseline seeds and catalog data
│   ├── i18n/
│   │   ├── languages.js         # Dictionary for az, en, ru, tr
│   │   └── LanguageContext.jsx  # Reactive i18n hook and provider
│   ├── App.jsx                  # Main application shell
│   └── main.jsx                 # Vite application entry point
├── .env.example                 # Environment variables specification template
├── .gitattributes               # Line endings and filetype definitions
├── .gitignore                   # Excludes node_modules, build outputs, and credentials
├── CHANGELOG.md                 # Version release history
├── CONTRIBUTING.md              # Contributor guide
├── index.html                   # HTML5 document shell with splash loader
├── LICENSE                      # MIT Open Source License
├── package.json                 # Project dependencies and script definitions
├── README.md                    # Comprehensive technical documentation
└── vite.config.js               # Bundler configuration and manual chunk splitting
```

---

## 6. Prerequisites

Ensure your development and hosting environments meet the following requirements:

- **Node.js**: `v18.0.0` or higher (Recommended: Node `v20.x LTS`)
- **Package Manager**: `npm` (v9+) or `pnpm` / `yarn`
- **PHP**: `v8.0` or higher with `pdo_mysql` and `json` extensions enabled
- **Database**: MySQL `v5.7+` or MariaDB `v10.3+`
- **Web Server**: Apache 2.4+ / LiteSpeed with `mod_rewrite` and `mod_headers` (Standard on Hostinger)

Verify local installations:
```bash
node -v
npm -v
php -v
mysql --version
```

---

## 7. Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/monodoxia-academy.git
   cd monodoxia-academy
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

3. **Initialize local environment configuration**:
   ```bash
   cp .env.example .env
   cp db_config.example.php db_config.php
   ```

---

## 8. Environment Variables

Create a `.env` file in the project root based on `.env.example`:

```env
# ==========================================
# Monodoxia Academy - Environment Variables
# ==========================================

# Database Configuration (Hostinger / cPanel / Local MySQL)
DB_HOST=localhost
DB_NAME=u310078278_monodoxia
DB_USER=u310078278_monodoxia
DB_PASS=your_secure_database_password_here

# Frontend Configuration
VITE_API_URL=/api.php
VITE_APP_TITLE=Monodoxia Academy
VITE_DEFAULT_LANG=az
```

> **Security Note**: Never commit `.env` or `db_config.php` containing production credentials. Both are protected in `.gitignore`.

---

## 9. Local Development

Start the local Vite development server:

```bash
npm run dev
```

Output:
```
  VITE v5.4.21  ready in 240 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

Open `http://localhost:3000` in your web browser. Any changes made to React components in `src/` will hot-reload instantly.

---

## 10. Backend & Database Setup

The backend communicates via `api.php` connecting to MySQL via PDO.

### Option A: Automated Web Migration
1. Set valid MySQL credentials in `db_config.php` or `.env`.
2. Access the Admin Panel on the frontend or visit in browser:
   ```
   http://localhost/api.php?action=migrate
   ```
3. The API will automatically create all missing tables (`mdx_users`, `mdx_courses`, `mdx_applications`, `mdx_categories`, etc.) and seed default records.

### Option B: Manual phpMyAdmin Import
1. Log in to **Hostinger hPanel** > **Databases** > **phpMyAdmin**.
2. Select your database (e.g. `u310078278_monodoxia`).
3. Click the **Import** tab.
4. Choose the schema file:
   `public/hostinger_monodoxia_schema.sql` (or root `hostinger_monodoxia_schema.sql`).
5. Click **Import** at the bottom.

---

## 11. Third-Party Service Configuration

- **Google Fonts**: Pre-connected in `index.html` (`Playfair Display`, `Cormorant Garamond`, `Plus Jakarta Sans`).
- **Material Symbols**: Integrated via Google Web Fonts CDN in `index.html`.
- **Payment Processing (Stripe / Local Gateways)**: Ready for integration in `src/components/modals/ApplicationModal.jsx` and `api.php?action=update_application_status`.

---

## 12. Cloud & Backend Services

This project is architected with a self-hosted **PHP + MySQL** backend tailored for standard web hosting (Hostinger, cPanel, VPS). If migrating to Firebase or Supabase:

- **Supabase**: Replace `api.php` endpoints in `src/context/AppContext.jsx` with `@supabase/supabase-js` client queries against the Postgres tables.
- **Firebase**: Replace `AppContext.jsx` state synchronizers with Firestore collections (`applications`, `courses`, `users`).

---

## 13. Build Instructions

To compile the application for production:

```bash
npm run build
```

Expected Build Output:
```
dist/index.html                  17.78 kB │ gzip:  5.96 kB
dist/assets/index-BYR9tlVa.css    9.19 kB │ gzip:  2.48 kB
dist/assets/vendor-nf7bT_Uh.js  140.87 kB │ gzip: 45.26 kB
dist/assets/index-BdhFRhhv.js   395.53 kB │ gzip: 94.66 kB
✓ built in ~3s
```

All compiled files, along with `api.php`, `.htaccess`, and assets, will be generated in the `dist/` directory.

To test the production build locally:
```bash
npm run preview
```

---

## 14. Production Configuration

### Hostinger Directory Layout
On Hostinger web hosting, the production directory structure inside `public_html/` should look like this:

```
public_html/
├── assets/
│   ├── index-BYR9tlVa.css
│   ├── index-BdhFRhhv.js
│   └── vendor-nf7bT_Uh.js
├── .htaccess                    # Configured security & rewrite rules
├── api.php                      # Live API endpoint
├── db_config.php                # Database credentials
├── db_config.example.php
└── index.html                   # SPA root document
```

---

## 15. GitHub Setup

### Initialize and Publish to GitHub

1. **Initialize Git**:
   ```bash
   git init
   ```

2. **Stage all repository files**:
   ```bash
   git add .
   ```

3. **Make initial commit**:
   ```bash
   git commit -m "feat: initial commit of Monodoxia Academy platform"
   ```

4. **Link your remote GitHub repository**:
   ```bash
   git branch -M main
   git remote add origin https://github.com/your-username/monodoxia-academy.git
   ```

5. **Push to GitHub**:
   ```bash
   git push -u origin main
   ```

---

## 16. Deployment Instructions

### A. Hostinger Deployment (Recommended)

1. Build the production bundle locally:
   ```bash
   npm run build
   ```
2. In Hostinger hPanel, go to **Databases** > **MySQL Databases**:
   - Create a database: `u310078278_monodoxia`
   - Create a database user and generate a secure password.
3. Open **phpMyAdmin**, import `hostinger_monodoxia_schema.sql`.
4. In Hostinger hPanel, open **File Manager** and navigate to `public_html/`.
5. Upload the **contents** of the local `dist/` folder directly into `public_html/`.
6. Create or edit `public_html/db_config.php` and set your database password:
   ```php
   <?php
   $db_host = 'localhost';
   $db_name = 'u310078278_monodoxia';
   $db_user = 'u310078278_monodoxia';
   $db_pass = 'YOUR_REAL_SECURE_PASSWORD';
   ```
7. Visit your domain: `https://your-domain.com`.

### B. Static Jamstack Deployment (Vercel / Netlify)

1. Connect your GitHub repository to Vercel or Netlify.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Deploy the `api.php` and database to a PHP/MySQL host (such as Hostinger or Railway), and set `VITE_API_URL` to point to the remote API domain.

### C. VPS Deployment (Ubuntu 22.04 + Nginx)

1. Configure Nginx virtual host:
   ```nginx
   server {
       listen 80;
       server_name monodoxia.academy www.monodoxia.academy;
       root /var/www/monodoxia/dist;
       index index.html index.php;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location ~ \.php$ {
           include snippets/fastcgi-php.conf;
           fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
       }

       location ~ /\.(ht|env|git) {
           deny all;
       }
   }
   ```
2. Enable SSL with Let's Encrypt:
   ```bash
   sudo certbot --nginx -d monodoxia.academy -d www.monodoxia.academy
   ```

---

## 17. Domain & HTTPS Configuration

- **Automatic SSL**: In Hostinger hPanel, enable **Lifetime Free SSL (Let's Encrypt)** under the **Security** tab.
- **HTTPS Enforcement**: Pre-configured in `public/.htaccess`:
  ```apache
  RewriteCond %{HTTPS} !=on
  RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
  ```

---

## 18. CI/CD Instructions

The repository includes a GitHub Actions workflow at [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

- **Triggers**: Runs on every `push` and `pull_request` to `main` and `master`.
- **Matrix**: Tests against Node.js 18.x and 20.x.
- **Verification**: Automatically runs `npm ci`, compiles with `npm run build`, and checks that all critical production assets exist.

To view CI status, check the **Actions** tab on your GitHub repository.

---

## 19. Troubleshooting

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **API Error: Hostinger SQL şifrəsi hələ təyin edilməyib** | Database password placeholder in `db_config.php` has not been replaced | Edit `public_html/db_config.php` and enter your actual MySQL user password. |
| **Database connection refused (500)** | Wrong database name, user, or host | Confirm credentials in Hostinger hPanel > MySQL Databases. Use `localhost` as host. |
| **404 on page refresh in subroutes** | Apache `mod_rewrite` is disabled or `.htaccess` missing | Ensure `dist/.htaccess` is uploaded to `public_html/.htaccess`. |
| **CORS errors when calling API** | Frontend domain differs from API domain | Ensure `api.php` includes `Access-Control-Allow-Origin: *` headers (pre-configured). |
| **Missing table errors in Admin Panel** | Schema not imported into MySQL | Run `https://yourdomain.com/api.php?action=migrate` or import `hostinger_monodoxia_schema.sql` via phpMyAdmin. |

---

## 20. Security Recommendations

1. **Hide Configuration**: Never commit `db_config.php` or `.env` files with real credentials.
2. **Directory Traversal Protection**: `.htaccess` denies web access to `.env`, `.sql`, `.log`, and `.git` files.
3. **Prepared Statements**: All database operations in `api.php` use PDO prepared statements to eliminate SQL injection risks.
4. **Security Headers**: `X-Content-Type-Options`, `X-Frame-Options`, and `X-XSS-Protection` headers are applied via `.htaccess`.
5. **Direct Access Guards**: Direct access to `db_config.php` returns HTTP 403 Forbidden.

---

## 21. Updating & Upgrading

To update dependencies:
```bash
# Check for outdated packages
npm outdated

# Upgrade dependencies within semver ranges
npm update

# Run production build to verify compatibility
npm run build
```

---

## 22. Contribution Guidelines

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, development workflow, and the pull request submission process.

---

## 23. License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 24. Contact & Project Information

- **Organization**: Monodoxia Academy (Fərdi İnkişaf və Psixologiya Mərkəzi)
- **Website**: [https://monodoxia.academy](https://monodoxia.academy)
- **Email**: contact@monodoxia.academy
- **Location**: Nizami küçəsi 142, İntellektual İnkişaf Mərkəzi, Bakı, Azərbaycan
- **Repository**: [https://github.com/your-username/monodoxia-academy](https://github.com/your-username/monodoxia-academy)
