# CurrencyHub 🌍

**Status: Work in Progress — Active Development**

CurrencyHub is a full-stack currency conversion application being developed using Next.js, TypeScript, and Supabase.

The goal is to build a reliable, user-friendly currency converter with secure user authentication, real-time exchange-rate integration, and persistent user data.

This repository represents the current development stage of the project. It is **not a finished or production-ready application**. Features are being implemented, tested, improved, and documented step by step.

## 🎯 Project Goals

- Convert amounts between different currencies.
- Retrieve current exchange rates through an external API.
- Provide user registration, email confirmation, login, and logout.
- Protect dashboard pages and API routes where authentication is required.
- Store user information and conversion history in a database.
- Build a responsive and professional user interface.
- Prepare the application for deployment and real-world usage.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Next.js (App Router) | Application framework and server-side functionality |
| React | User interface |
| TypeScript | Type safety |
| Supabase Auth | User authentication |
| Supabase Database | Planned persistent data storage |
| External exchange-rate API | Currency exchange rates |
| Git & GitHub | Version control and project history |
| Vercel | Planned deployment |

## ✅ Current Progress

The following milestones have been implemented or tested:

### 1. Project Setup
- Next.js application initialized.
- App Router structure established.
- TypeScript configured.
- Development environment running locally.

### 2. Currency Conversion API
- Next.js API route for currency conversion implemented.
- Currency-list API route implemented.
- External exchange-rate provider integrated.
- Basic request validation implemented.
- API health endpoint tested successfully.
- Successful conversion requests tested.

### 3. Authentication — Initial Implementation
- Supabase project connected.
- Browser and server Supabase clients configured.
- Signup form implemented.
- Email confirmation flow implemented.
- Login form implemented.
- Logout functionality implemented.
- Protected dashboard route implemented.
- Initial signup, confirmation, login/session, and logout flow tested successfully.

**Note:** Authentication is functional at the initial implementation stage, but still needs additional security review, edge-case testing, and reliability verification.

### 4. Dashboard and Interface
- Initial CurrencyHub dashboard implemented.
- Authentication-related pages implemented.
- Basic application navigation and interface established.

## 🚧 Remaining Work / Development Roadmap

The following tasks are planned or still require completion.

### Phase 1 — Database Integration
- Design the database schema.
- Create the required Supabase tables.
- Connect authenticated users to their own data.
- Implement conversion-history storage.
- Retrieve and display saved conversion history.
- Configure Row Level Security (RLS) policies.
- Test data access and user isolation.

### Phase 2 — Authentication Hardening
- Investigate and fully verify the earlier PKCE verifier issue.
- Test signup and email confirmation repeatedly.
- Test login and logout across fresh browser sessions.
- Test expired links, invalid credentials, and duplicate accounts.
- Verify session refresh and cookie handling.
- Review protected routes and authorization checks.
- Review authentication-related security settings.

### Phase 3 — Currency Conversion Improvements
- Improve API error handling.
- Handle unavailable exchange-rate providers.
- Add loading, empty, and error states.
- Handle network failures and invalid API responses.
- Verify currency conversion accuracy.
- Review caching and exchange-rate update behavior.

### Phase 4 — Testing and Quality
- Test individual components and API routes.
- Test authentication and database integration together.
- Test invalid inputs and edge cases.
- Test responsive layouts on different screen sizes.
- Run production build checks.
- Resolve linting and TypeScript errors.

### Phase 5 — Deployment and Production Readiness
- Review environment variables and secret handling.
- Configure production Supabase URLs and redirect URLs.
- Deploy through Vercel.
- Test authentication and conversion on the deployed application.
- Verify database permissions and user data isolation.
- Perform a final end-to-end review.

## 📌 Current Development Stage

**Last major progress milestone: Initial authentication and currency-conversion API implementation.**

The application has moved beyond a basic frontend prototype. It has a working local Next.js application, exchange-rate API integration, an initial Supabase authentication flow, and a protected dashboard.

The next major milestone is **Supabase database integration**, followed by authentication hardening and end-to-end testing.

## ⚠️ Project Status

This project is currently under active development.

- Database-backed conversion history is not yet complete.
- Authentication requires further reliability and security testing.
- Production deployment and end-to-end verification are pending.
- Features and architecture may change as development progresses.

The repository is maintained as a record of the application's development, implementation decisions, improvements, and learning process.

## ▶️ Running Locally

Local setup instructions will be maintained as the project configuration and database integration are finalized.

Do not commit `.env.local` or any private API keys, service-role keys, or other secrets to the repository.

---

**CurrencyHub — Building a practical full-stack application, one milestone at a time.**