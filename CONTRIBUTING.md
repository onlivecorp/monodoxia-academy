# Contributing to Monodoxia Academy

Thank you for your interest in contributing to Monodoxia Academy!

## Code of Conduct

We are committed to providing a welcoming, inclusive, and professional environment. Please treat all contributors and community members with respect.

## Getting Started

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/monodoxia-academy.git
   cd monodoxia-academy
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

- Run the local dev server:
  ```bash
  npm run dev
  ```
- Build and verify production assets before committing:
  ```bash
  npm run build
  ```
- Test changes in your browser at `http://localhost:3000`.

## Branch Naming Conventions

- `feature/description` — For new capabilities
- `fix/description` — For bug fixes
- `docs/description` — For documentation updates
- `refactor/description` — For code restructuring without behavior changes

## Pull Request Guidelines

1. Ensure the production build completes successfully (`npm run build`).
2. Keep PRs focused on a single responsibility.
3. Provide a clear description of the changes made and the problem being solved.
4. Do NOT commit real passwords, credentials, `.env` files, or production database credentials.
