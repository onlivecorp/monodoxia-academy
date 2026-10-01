# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-01

### Added
- **Core Platform**: Complete React 18 frontend with custom luxury academic design system.
- **Multilingual System (i18n)**: Centralized support for Azerbaijani (AZ), English (EN), Russian (RU), and Turkish (TR).
- **Backend API**: PHP PDO backend (`api.php`) with MySQL integration, CRUD operations, transactions, and JSON response handling.
- **Application & Registration Flow**: Interactive course/club application modal with dynamic custom fields and offline-first fallback.
- **Admin Console**: Full management modal for courses, categories, club tiers, applications, form fields, and platform settings.
- **Database Schema**: Comprehensive MySQL schema (`hostinger_monodoxia_schema.sql`) covering users, courses, registrations, topics, notifications, and form fields.
- **Production Optimization**: Automated code splitting with Rollup manual chunks in Vite.
- **Security & Server Configuration**: `.htaccess` with SPA rewrite rules, HTTPS enforcement, sensitive file blocking, and caching headers.
- **CI/CD Pipeline**: GitHub Actions workflow for automated multi-version Node build validation.
