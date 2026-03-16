# ✅ RTE Platform — Master TODO
> **Project:** righttoeducation.in  
> **Stack:** React 18 + Vite (frontend) · Node.js + Express (backend) · MongoDB Atlas  
> **Created:** March 2026 · **Author:** Ayush Pandey  
> **Legend:** ☐ Not Started · ⚙️ In Progress · ✅ Done

---

## 📦 PHASE 0 — Project Scaffolding & Dev Environment

### 0.1 Repository & Monorepo Setup
- [ ] Create GitHub repository `righttoeducation`
- [ ] Set up monorepo structure with `/client` and `/server` folders
- [ ] Add root-level `.gitignore` (node_modules, .env, dist, build)
- [ ] Add `README.md` with project overview and setup instructions
- [ ] Set up branch protection rules (`main` branch — PR required)

### 0.2 Frontend Scaffold (React + Vite)
- [x] Initialise Vite project inside `/client` (`npm create vite@latest`)
- [x] Install all frontend dependencies (see Section 14.1 of Tech Stack doc)
- [x] Configure `vite.config.js` with path aliases (`@/` → `src/`)
- [x] Set up Tailwind CSS with `tailwind.config.js` and `postcss.config.js`
- [x] Configure `@tailwindcss/typography` and `@tailwindcss/forms` plugins
- [x] Add `.env.example` with `VITE_API_URL=http://localhost:5000/api/v1`
- [x] Set up `src/` folder structure: `components/`, `pages/`, `features/`, `hooks/`, `store/`, `services/`, `assets/`, `utils/`, `animations/`
- [x] Configure ESLint + Prettier with project rules
- [x] Install Google Fonts (Playfair Display, DM Sans, DM Mono) via `<link>` in `index.html`

### 0.3 Backend Scaffold (Express + MongoDB)
- [ ] Initialise Node.js project inside `/server` (`npm init -y`)
- [ ] Install all backend dependencies (see Section 14.2 of Tech Stack doc)
- [ ] Set up `src/` folder structure: `controllers/`, `routes/`, `models/`, `middleware/`, `services/`, `utils/`, `config/`
- [ ] Configure `nodemon` for development auto-restart
- [ ] Create `server.js` entry point with Express app setup
- [ ] Add `.env.example` with all required environment variable keys
- [ ] Configure `morgan` for request logging
- [ ] Configure `compression` middleware for Gzip
- [ ] Configure `helmet` security headers
- [ ] Configure `cors` (restricted to Vercel frontend origin for production)
- [ ] Add global error-handling middleware
- [ ] Set up `config/db.js` for Mongoose connection with connection pooling

### 0.4 Database Setup
- [ ] Create MongoDB Atlas cluster (M0 Free tier)
- [ ] Configure Atlas IP allowlist (Railway IP + dev IPs only — no `0.0.0.0/0`)
- [ ] Create database user with least-privilege credentials
- [ ] Connect Mongoose to Atlas URI via environment variable
- [ ] Write seed script (`npm run seed`) — 36 states, 10 test users, sample content
- [ ] Write seed-clear script (`npm run seed:clear`)

### 0.5 CI / CD Pipeline
- [ ] Connect GitHub repo to Vercel (frontend auto-deploy on push to `main`)
- [ ] Connect GitHub repo to Railway (backend auto-deploy on push to `main`)
- [ ] Add GitHub Actions workflow for lint + test on every PR
- [ ] Configure environment variables on Vercel and Railway dashboards
- [ ] Set up UptimeRobot to monitor production backend URL

---

## 🔐 PHASE 1 — Authentication & User Management

### 1.1 Backend — Auth Models & Middleware
- [ ] Create `User` Mongoose model with fields: `_id`, `name`, `email`, `passwordHash`, `role` (`citizen` / `moderator` / `admin`), `state`, `userType`, `isVerified`, `createdAt`
- [ ] Create `RefreshToken` model (store bcrypt-hashed token, userId, expiry, device info)
- [ ] Write `hashPassword` utility using `bcryptjs` (12 rounds)
- [ ] Write `generateAccessToken` JWT utility (15-minute expiry)
- [ ] Write `generateRefreshToken` JWT utility (7-day expiry)
- [ ] Write `verifyToken` middleware to protect routes (`Authorization: Bearer <token>`)
- [ ] Write `requireRole(roles[])` middleware for role-based access control
- [ ] Apply `express-rate-limit` on auth routes: 5 requests / 15 min / IP

### 1.2 Backend — Auth Endpoints (`/api/v1/auth`)
- [ ] `POST /register` — validate with Zod, hash password, send verification email, return user object (no token until verified)
- [ ] `POST /login` — validate credentials, issue access token (JSON) + refresh token (httpOnly secure cookie)
- [ ] `POST /logout` — delete refresh token from DB, clear cookie
- [ ] `POST /refresh` — validate refresh token cookie, rotate with new token pair
- [ ] `POST /forgot-password` — generate reset token, send email with link
- [ ] `PATCH /reset-password` — validate reset token, update passwordHash, invalidate all refresh tokens for user
- [ ] `POST /verify-email` — validate email verification token, set `isVerified: true`
- [ ] Write Nodemailer + Handlebars email templates: welcome, verification, password reset, grievance notification

### 1.3 Frontend — Auth Feature (`src/features/auth/`)
- [ ] Create Zustand `authStore` with: `user`, `accessToken`, `isAuthenticated`, `login()`, `logout()`, `refreshToken()`, `register()`
- [ ] Set up Axios instance in `src/services/api.js` with base URL and JWT interceptor (auto-attach token, auto-refresh on 401)
- [ ] Build `RegisterPage` (`/register`): form with name, email, password, state, user type; Zod + react-hook-form validation; show success message to check email
- [ ] Build `LoginPage` (`/login`): email + password form; remember me option; redirect to intended page after login
- [ ] Build `ForgotPasswordPage` (`/forgot-password`): email input form
- [ ] Build `ResetPasswordPage` (`/reset-password/:token`): new password + confirm form
- [ ] Build `EmailVerificationPage` (`/verify-email/:token`): auto-verify on mount, show result
- [ ] Create `ProtectedRoute` wrapper component (redirect to login if unauthenticated)
- [ ] Create `RoleGate` component (show/hide UI sections based on role)

### 1.4 User Profile (`/api/v1/users`)
- [ ] `GET /me` — return authenticated user's profile
- [ ] `PATCH /me` — update name, state, userType, avatar; validate with Zod
- [ ] `GET /:id` (admin only) — return any user's profile
- [ ] Build `ProfilePage` (`/profile`): display user info, edit form, activity summary (questions asked, grievances filed)

---

## 🗺️ PHASE 2 — States & Compliance Module

### 2.1 Backend — State Data
- [ ] Create `State` Mongoose model: `_id`, `name`, `slug`, `region`, `complianceScore` (0–100), `complianceLabel`, `contactEmail`, `lastUpdated`
- [ ] Create `StateContent` Mongoose model: `_id`, `state` (ref), `category` (acts / reports / judgements / implementation / grievanceRedressal / news), `title`, `date`, `fileUrl`, `externalUrl`, `description`, `createdAt`
- [ ] Seed all 36 Indian states + UTs with initial compliance scores
- [ ] Add compound indexes on `StateContent`: `{state, category}`, `{state, createdAt}`
- [ ] `GET /api/v1/states` — return all states with scores (for map + list)
- [ ] `GET /api/v1/states/:stateSlug` — return full state detail with compliance breakdown
- [ ] `GET /api/v1/states/:stateSlug/content` — return paginated state content (filter by category)
- [ ] `POST /api/v1/state-content` (admin) — add new content item for a state
- [ ] `PATCH /api/v1/state-content/:id` (admin) — update content item

### 2.2 Frontend — Interactive India Map
- [ ] Install and configure `d3` and `topojson-client`
- [ ] Obtain India TopoJSON file (state-level boundaries)
- [ ] Build `IndiaMap` D3 component: render all states as SVG paths, colour-coded by compliance score
- [ ] Implement hover interaction: show tooltip with state name + compliance badge (colour-coded: green ≥ 70, amber 40–69, red < 40)
- [ ] Implement click interaction: animate slide-in panel with state summary cards before navigating to state page
- [ ] Ensure map is responsive and works on mobile (pan + pinch zoom or simplified mobile view)
- [ ] Add ARIA labels and keyboard navigation for accessibility

### 2.3 Frontend — State Pages
- [ ] Build `StatesListPage` (`/states`): grid of all 36 states with compliance score badges, search/filter by region
- [ ] Build `StateDetailPage` (`/states/:stateSlug`): compliance score gauge, content library tabs (Acts, Reports, Judgements, Implementation, Grievance Redressal, News), contact info
- [ ] Build `StateContentList` component: paginated list with file download links and external links
- [ ] Add `ComplianceScoreBadge` reusable component (colour-coded label + numeric score)

### 2.4 Admin — State Content Management
- [ ] Build admin UI: `StateContentForm` — add/edit content with file upload (PDF/image) or external URL
- [ ] Build admin UI: bulk import state content via CSV upload
- [ ] Build admin UI: Edit compliance scores for any state

---

## 💬 PHASE 3 — Community Q&A Module

### 3.1 Backend — Questions & Answers
- [ ] Create `Question` Mongoose model: `_id`, `title`, `body`, `author` (ref), `state`, `category`, `tags[]`, `answers[]`, `upvotes[]`, `answerCount`, `status` (`open` / `answered` / `closed`), `createdAt`
- [ ] Create `Answer` Mongoose model: `_id`, `questionId` (ref), `body`, `author` (ref), `upvotes[]`, `isVerified`, `createdAt`
- [ ] Add compound indexes: `{state, category, createdAt}`, `{author, createdAt}`, `{status, createdAt}`
- [ ] `GET /api/v1/questions` — paginated list (filter by state, category, status, tag); cursor-based pagination
- [ ] `POST /api/v1/questions` — create question (auth required + `isVerified: true`)
- [ ] `GET /api/v1/questions/:id` — full question with answers
- [ ] `PATCH /api/v1/questions/:id` — edit own question (or admin)
- [ ] `DELETE /api/v1/questions/:id` — delete own question (or moderator/admin)
- [ ] `POST /api/v1/questions/:id/answers` — post an answer (auth required)
- [ ] `POST /api/v1/questions/:id/upvote` — toggle upvote on question
- [ ] `POST /api/v1/questions/:id/answers/:answerId/upvote` — toggle upvote on answer
- [ ] Moderator: `PATCH /api/v1/questions/:id/mark-answered` — mark best answer as verified
- [ ] Moderator: `PATCH /api/v1/questions/:id/status` — open / close question

### 3.2 Frontend — Q&A Feature (`src/features/community/`)
- [ ] Build `QuestionsListPage` (`/community/questions`): paginated feed with filter bar (state, category, status), search box
- [ ] Build `QuestionCard` component: title, tags, state badge, upvote count, answer count, author + timestamp (memoised with `React.memo`)
- [ ] Build `AskQuestionPage` (`/community/ask`): Tiptap rich text editor for body, tag input, state selector; react-hook-form + Zod
- [ ] Build `QuestionDetailPage` (`/community/questions/:id`): question body, answer list, post answer form, upvote buttons
- [ ] Build `AnswerCard` component: body, author, verified badge, upvote; memoised
- [ ] Implement upvote toggle with optimistic UI update
- [ ] Show "Login to participate" prompt for unauthenticated users

### 3.3 Backend — Discussions
- [ ] Create `Discussion` Mongoose model: `_id`, `title`, `body`, `author` (ref), `category`, `replies[]`, `isPinned`, `createdAt`
- [ ] `GET /api/v1/discussions` — paginated list
- [ ] `POST /api/v1/discussions` — create discussion (auth required)
- [ ] `GET /api/v1/discussions/:id` — full thread with replies
- [ ] `POST /api/v1/discussions/:id/replies` — add reply
- [ ] `DELETE /api/v1/discussions/:id` — delete (own or moderator/admin)
- [ ] Moderator: pin/unpin discussions

### 3.4 Frontend — Discussions
- [ ] Build `DiscussionsListPage` (`/community/discussions`): list with pinned items at top
- [ ] Build `DiscussionDetailPage` (`/community/discussions/:id`): thread view with nested replies
- [ ] Build `StartDiscussionPage` (`/community/discuss`): form with Tiptap editor

---

## 📋 PHASE 4 — Grievance Filing & Tracking

### 4.1 Backend — Grievances
- [ ] Create `Grievance` Mongoose model: `_id`, `refNumber` (unique auto-generated), `author` (ref), `state`, `category`, `description`, `attachments[]` (Cloudinary URLs), `status` (`filed` / `reviewing` / `resolved` / `escalated`), `adminNotes[]`, `createdAt`, `updatedAt`
- [ ] Add index on `{author, createdAt}` and `{state, status, createdAt}`
- [ ] `POST /api/v1/grievances` — file grievance with file upload (multer + Cloudinary); validate type (PDF/PNG/JPG) + 20MB limit; send confirmation email with ref number
- [ ] `GET /api/v1/grievances/my` — list authenticated user's own grievances
- [ ] `GET /api/v1/grievances/:id` — read own grievance (or admin)
- [ ] `PATCH /api/v1/grievances/:id/status` (admin) — update status + add admin note; send notification email to user

### 4.2 Cloudinary File Upload Utility
- [ ] Configure Cloudinary credentials via environment variables
- [ ] Write `uploadToCloudinary(fileBuffer, resourceType)` utility using `streamifier`
- [ ] Write `deleteFromCloudinary(publicId)` utility
- [ ] Apply multer middleware (`memoryStorage`) for in-memory file handling before Cloudinary upload
- [ ] Enforce file type whitelist (PDF / PNG / JPG) and 20MB max size in multer config

### 4.3 Frontend — Grievance Feature
- [x] Build `FileGrievancePage` (`/grievances/file`): multi-step form (Step 1: state + category + description · Step 2: attach files · Step 3: review + submit); Zod validation implemented.
- [ ] Build `MyGrievancesPage` (`/grievances/my`): list of user's filed grievances with ref number, status badge, date
- [ ] Build `GrievanceDetailPage` (`/grievances/:id`): full details + animated status tracker (step indicator: Filed → Reviewing → Resolved/Escalated) + admin notes (read-only for citizen)
- [ ] Build `GrievanceStatusTracker` animated component (colour-coded stages with Framer Motion)
- [ ] Show ref number prominently after successful submission

---

## 📰 PHASE 5 — News Module

### 5.1 Backend — News
- [ ] Create `News` Mongoose model: `_id`, `title`, `summary`, `source`, `sourceUrl`, `state`, `category`, `publishedAt`, `addedBy` (ref)
- [ ] Add Atlas Search index on `news` collection for full-text search
- [ ] `GET /api/v1/news` — paginated; filter by `state`, `category`, `q` (full-text search); cursor-based pagination
- [ ] `GET /api/v1/news/:id` — single article
- [ ] `POST /api/v1/news` (admin) — add news article

### 5.2 Frontend — News
- [ ] Build `NewsPage` (`/news`): virtualised feed (`react-window`) with filter bar (state, category) and search input
- [ ] Build `NewsCard` component: title, source badge, state badge, summary, date; memoised with `React.memo`
- [ ] Build `NewsDetailPage` (`/news/:id`): full article view with external source link

---

## 📖 PHASE 6 — Blog & Resource Library

### 6.1 Backend — Blog
- [ ] Create `BlogPost` Mongoose model: `_id`, `title`, `slug` (unique, URL-safe), `body` (rich text HTML), `author` (ref), `featuredImage` (Cloudinary URL), `tags[]`, `isFeatured`, `publishedAt`
- [ ] Sanitise body HTML with `DOMPurify` / server-side equivalent before storage
- [ ] `GET /api/v1/blog` — list of published posts (paginated)
- [ ] `GET /api/v1/blog/:slug` — full post by slug
- [ ] `POST /api/v1/blog` (admin) — create post with Tiptap-generated HTML
- [ ] `PATCH /api/v1/blog/:id` (admin) — update post

### 6.2 Backend — Document Library
- [ ] Create `Document` Mongoose model: `_id`, `title`, `fileUrl`, `fileType`, `fileSize`, `uploadedBy` (ref), `associatedState`, `category`, `createdAt`
- [ ] `POST /api/v1/documents/upload` (admin) — upload PDF to Cloudinary, save record
- [ ] `GET /api/v1/documents` — list documents (filter by state, category)
- [ ] `DELETE /api/v1/documents/:id` (admin) — delete from Cloudinary + DB

### 6.3 Frontend — Blog
- [ ] Build `BlogListPage` (`/blog`): card grid with featured post hero at top, tag filters
- [ ] Build `BlogDetailPage` (`/blog/:slug`): full article with `react-markdown` + `rehype-sanitize` render, share buttons, author card
- [ ] Build admin `BlogEditorPage`: Tiptap rich text editor, featured image upload, tag input, publish toggle

### 6.4 Frontend — Resource Library
- [ ] Build `ResourcesPage` (`/resources`): searchable, filterable document library; filter by state + category
- [ ] Build `DocumentCard` component: title, file type badge, size, download button

---

## 🔍 PHASE 7 — Global Search

### 7.1 Backend — Search
- [ ] Configure MongoDB Atlas Search indexes on: `questions` (title, body, tags), `news` (title, summary), `blogPosts` (title, body, tags), `stateContent` (title, description)
- [ ] `GET /api/v1/search?q=&type=&state=` — federated search across all collections; return typed results with source label

### 7.2 Frontend — Search
- [ ] Build global search bar in navbar (visible on all pages): debounced input → calls `/api/v1/search`
- [ ] Build `SearchResultsPage` (`/search?q=`): grouped results by type (Questions · News · Blog · State Content) with type filter tabs
- [ ] Add keyboard shortcut (`Cmd+K` / `Ctrl+K`) to open search modal

---

## 📊 PHASE 8 — Admin Dashboard

### 8.1 Backend — Admin Stats
- [ ] `GET /api/v1/stats` (public) — total users, questions, grievances resolved (summary numbers for homepage)
- [ ] `GET /api/v1/stats/admin` (admin only) — full dashboard: daily/weekly/monthly signups, questions asked/answered, grievances filed/resolved, most active states, most searched terms, content publish log

### 8.2 Frontend — Admin Panel
- [ ] Build `AdminLayout` with sidebar navigation: Users · Moderation · States · News · Blog · Documents · Analytics
- [ ] Build `AdminDashboardPage` (`/admin`): stat cards + activity charts using D3 or a lightweight chart library
- [ ] Build `UserManagementPage` (`/admin/users`): table of all users, filter by role/state, search by name/email, assign roles, ban/suspend
- [ ] Build `ModerationQueuePage` (`/admin/moderation`): list of flagged/pending questions, discussions, grievances; approve / reject / delete actions; verify answers
- [ ] Build `StateContentManagerPage` (`/admin/states`): select state → add/edit content items, update compliance score, bulk CSV import
- [ ] Build `NewsManagerPage` (`/admin/news`): add/edit/delete news articles
- [ ] Build `BlogManagerPage` (`/admin/blog`): list posts, link to editor, toggle featured/published

---

## 🏠 PHASE 9 — Public Pages & Navigation

### 9.1 Homepage (`/`)
- [x] Build `HeroSection`: implement GSAP book animation (covers open → pages spread → content blocks emerge); integrated all sections (Stats, States, Features, CTA) into the book animation sequence.
- [x] Build `StatsSection`: integrated into book animation via `CountUp` component.
- [x] Build `FeaturedStatesSection`: integrated into book animation as Block 5.
- [x] Build `NewsHighlightsSection`: integrated into book animation as Block 4.
- [ ] Build `BlogPreviewSection`: 2–3 recent blog posts
- [x] Build `CTASection`: integrated into book animation as Block 7.
- [x] Ensure homepage Lighthouse score ≥ 90 (cleaned up impure functions and cascading renders).

### 9.2 Know Your RTE — Informational Pages
- [ ] Build `AboutRTEPage` (`/know-your-rte/about`): what is RTE Act 2009, key provisions, static content
- [ ] Build `RightsPage` (`/know-your-rte/rights`): rights of children and parents under RTE
- [ ] Build `ObligationsPage` (`/know-your-rte/obligations`): obligations of schools and government
- [ ] Build `PenaltiesPage` (`/know-your-rte/penalties`): penalties for non-compliance

### 9.3 Navigation & Layout
- [ ] Build `Navbar`: logo, nav links, search icon, auth buttons (Login / Register or user avatar menu); active link highlight; mobile hamburger menu with animated slide-in drawer
- [ ] Build `Footer`: links to all major sections, social links, contact info, copyright
- [ ] Implement `Breadcrumb` component for deep pages (state → content, community → question)
- [ ] Implement Framer Motion `AnimatePresence` page transitions (fade + slide between routes)
- [ ] Set up React Router v6 with all routes defined in `src/router.jsx`
- [ ] Implement React.lazy + Suspense on all route-level components (reduce initial bundle by ~40%)

### 9.4 SEO & Meta
- [ ] Install `react-helmet-async` for dynamic meta tags
- [ ] Add `<title>` and `<meta name="description">` to every page
- [ ] Add Open Graph tags (`og:title`, `og:description`, `og:image`) on blog and news pages
- [ ] Generate `sitemap.xml` for all public static routes
- [ ] Add `robots.txt`
- [ ] Use clean, human-readable URLs (slugs, not IDs) on blog and state pages

---

## ⚡ PHASE 10 — Performance & Optimisation

### 10.1 Frontend Performance
- [ ] Verify React.lazy + Suspense on every route component (target: −40% initial bundle)
- [ ] Convert all uploaded images to WebP format with `srcSet` for responsive loading
- [ ] Add `loading="lazy"` to all below-the-fold images
- [ ] Set `font-display: swap` and preload critical fonts in `<head>`
- [ ] Import only used GSAP plugins (not full bundle) — target: −80KB bundle
- [ ] Implement `react-window` virtualised lists for news feed and Q&A list (> 50 items)
- [ ] Wrap `QuestionCard` and `NewsCard` with `React.memo`
- [ ] Add `<Link>` prefetch on hover for state pages
- [ ] Run Tailwind CSS PurgeCSS in production build (target: −95% CSS size)
- [ ] Run Lighthouse audit; iterate until score ≥ 90

### 10.2 Backend Performance
- [ ] Add all compound indexes defined in DB schema (Section 7 of PRD)
- [ ] Implement cursor-based pagination for news and questions (never skip-based)
- [ ] Use field projection on all queries (never return `passwordHash` or sensitive fields)
- [ ] Store `answerCount` as denormalised field on `Question` model (avoid `$lookup` for count)
- [ ] Verify `compression` (Gzip) middleware is active and measured (target: −70% payload)
- [ ] Verify Mongoose connection pooling is not reconnecting per request
- [ ] Verify `express-rate-limit` is active on all route groups

---

## 🔒 PHASE 11 — Security Hardening

- [ ] Verify `bcrypt` password hashing at 12 rounds on all password operations
- [ ] Verify access tokens expire in exactly 15 minutes
- [ ] Verify refresh tokens are stored as bcrypt hashes in DB
- [ ] Verify refresh token cookie is `httpOnly`, `secure`, `sameSite=strict`
- [ ] Verify email verification is required before community actions (ask question, file grievance)
- [ ] Apply `express-mongo-sanitize` on all routes
- [ ] Apply `xss-clean` on all text inputs
- [ ] Apply Zod schema validation in every controller before processing
- [ ] Apply file upload whitelist (PDF / PNG / JPG only) + 20MB max in multer
- [ ] Verify `helmet` middleware is active in production
- [ ] Verify CORS is restricted to Vercel frontend origin in production
- [ ] Verify auth routes are rate-limited: 5 req / 15 min / IP
- [ ] Verify API routes are rate-limited: 100 req / 15 min / IP
- [ ] Verify no secrets are committed to the repo; all in `.env` (gitignored)
- [ ] Verify `.env.example` is committed with empty values only
- [ ] Verify MongoDB Atlas IP allowlist contains only Railway IP(s) and dev IPs
- [ ] Verify no `0.0.0.0/0` entry in Atlas network access
- [ ] Sanitise all blog post HTML with DOMPurify before storage
- [ ] Sanitise all Markdown output with `rehype-sanitize` before render
- [ ] Run final OWASP Top 10 checklist review before go-live

---

## 🎨 PHASE 12 — Design System & UI Polish

### 12.1 Design Tokens
- [ ] Define CSS/Tailwind design tokens: Navy `#1A2744`, Saffron `#E8872A`, Parchment `#F5EFE0`, Ink `#333333`, Muted Gray `#888888`, Success Green `#2E7D32`, Alert Red `#C62828`
- [ ] Configure custom fonts in Tailwind: Playfair Display (display/headings), DM Sans (body/subheadings), DM Mono (code/refs)
- [ ] Define typography scale: Hero 72px, H1 36px, H2-H3 24–28px, Body 16–18px (line-height 1.7), Captions 13–14px

### 12.2 Animations & Motion
- [ ] Build GSAP `bookOpenTimeline` in `src/animations/bookHero.js` (2.5s sequence, prefers-reduced-motion guard)
- [ ] Build Framer Motion scroll-reveal variants: count-up stats, slide-in headings, stagger card grids
- [ ] Build Framer Motion `AnimatePresence` page transition wrapper
- [ ] Build Framer Motion `GrievanceStatusTracker` step indicator animation
- [ ] Test all animations on a low-end Android device profile in Chrome DevTools

### 12.3 Accessibility (WCAG 2.1 AA)
- [ ] Add `alt` text to every `<img>` element
- [ ] Ensure all interactive elements are keyboard navigable (Tab order, focus rings)
- [ ] Add ARIA labels to icon-only buttons, the India map SVG, and the status tracker
- [ ] Verify colour contrast ratios meet AA requirements for all text/background combinations
- [ ] Test with a screen reader (VoiceOver / NVDA)

---

## 🧪 PHASE 13 — Testing

### 13.1 Backend Unit & Integration Tests
- [ ] Set up Jest + Supertest in `/server`
- [ ] Write tests for `tokenUtils` (generate, verify, rotate)
- [ ] Write tests for auth controllers (register, login, refresh, logout)
- [ ] Write tests for grievance status update and email notification trigger
- [ ] Write tests for compliance score calculation utilities (if applicable)
- [ ] Write integration tests for all API route groups using Supertest + MongoDB Memory Server

### 13.2 Frontend Testing
- [ ] Set up Vitest + React Testing Library in `/client`
- [ ] Write tests for auth store (login, logout, token refresh)
- [ ] Write tests for `GrievanceStatusTracker` renders correct stage colour
- [ ] Write smoke tests for all page-level components (renders without crashing)

---

## 🚀 PHASE 14 — Deployment & Go-Live

- [ ] Configure Vercel project: set `VITE_API_URL` production env variable, enable HTTPS, set custom domain `righttoeducation.in`
- [ ] Configure Railway project: set all backend `.env` production values (MongoDB URI, JWT secrets, Cloudinary, SMTP credentials)
- [ ] Verify Railway backend is live and reachable by Vercel frontend
- [ ] Set up Sentry on both frontend and backend (free tier; 5K errors/month)
- [ ] Set up Plausible Analytics (self-hosted on Railway or paid `$9/mo`)
- [ ] Verify UptimeRobot monitors are active for production backend URL
- [ ] Run full security checklist (Phase 11) on production environment
- [ ] Run Lighthouse audit on production homepage (target: ≥ 90)
- [ ] Perform end-to-end smoke test: register → verify email → ask question → file grievance → admin resolves grievance → user sees update
- [ ] Commit final `RTE_TechStack_v1.0.docx` version history entry

---

## 📝 Ongoing / Maintenance
- [ ] Keep package versions up to date (monthly dependency audit)
- [ ] Review Sentry error reports weekly during beta
- [ ] Monitor MongoDB Atlas storage usage (upgrade to M10 if approaching free-tier limit)
- [ ] Update state compliance scores as new government data is published
- [ ] Moderate community content queue (moderator responsibility)
- [ ] Rotate JWT secrets every 90 days and invalidate all refresh tokens after rotation
