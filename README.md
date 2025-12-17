# 🚀 SpectraFlow: Distributed Scraping Engine

**Tagline:** A hybrid PHP-Python asynchronous data extraction platform.

## 1. Project Concept

**SpectraFlow** is a microservices-style application that allows users to submit URLs for scraping via a REST API. Instead of making the user wait, the system processes these requests asynchronously using a background queue worker.

- **The "Brain":** Laravel (PHP) handles the API, authentication, and job orchestration.
- **The "Muscle":** Python scripts execute inside a custom isolated runtime to perform the actual scraping.
- **The "Face":** A React Dashboard visualizes job status in real-time.

---

## 2. System Architecture

The system follows an **Event-Driven Architecture**:

1.  **Client/Frontend:** User submits a URL via the React Dashboard.
2.  **API Gateway (Laravel):** Validates the request, creates a "Pending" Job ID, and pushes the task to **Redis**. Returns `202 Accepted` immediately.
3.  **Queue Worker (Docker):** A dedicated background process picks up the job.
4.  **Hybrid Runtime:** The worker executes a **Python script** via the shell, passing the target URL.
5.  **Data Persistence:** Python returns JSON data; Laravel captures it and saves it to a **PostgreSQL JSONB** column.
6.  **Real-Time Update:** The Dashboard polls the API to update the status from _Processing_ → _Completed_.

---

## 3. Technical Stack (Resume Keywords)

| Component        | Technology                    | Why it was chosen                                                          |
| :--------------- | :---------------------------- | :------------------------------------------------------------------------- |
| **Backend API**  | **Laravel 11** (PHP 8.2)      | Robust routing, Eloquent ORM, and Queue management.                        |
| **Scraper Core** | **Python 3** (BeautifulSoup4) | Best-in-class libraries for parsing HTML and data extraction.              |
| **Frontend**     | **React 18** + **Tailwind**   | Modern, responsive UI with fast build times (Vite) & Glassmorphism design. |
| **Database**     | **PostgreSQL 15**             | Native support for **JSONB** (perfect for unstructured scraped data).      |
| **Queue/Cache**  | **Redis**                     | High-performance in-memory messaging for async jobs.                       |
| **DevOps**       | **Docker** & **Compose**      | Complete containerization with custom hybrid runtimes.                     |

---

## 4. Key Engineering Features

- **Hybrid Runtime Container:** Engineered a custom `Dockerfile` that layers Python 3 on top of PHP-FPM, allowing seamless interoperability.
- **Asynchronous Processing:** Long-running scraping tasks do not block the web server, ensuring a responsive API.
- **Polyglot Persistence:** Utilizes Relational columns for Users/Jobs (UUIDs) and NoSQL (JSONB) columns for flexible payload storage.
- **Secure Authentication:** Full user registration/login flow powered by **Laravel Sanctum**.
- **Premium UI/UX:** Animated React components with Framer Motion, deep dark mode, and glassmorphism cards.

---

## 5. Final Directory Structure

```text
spectra-flow/
├── backend/                 # Laravel API (The Brain)
│   ├── app/Jobs/            # ProcessScrapeJob.php (The Bridge to Python)
│   ├── app/Http/            # Controllers (JobController, AuthController)
│   └── database/            # Migrations (Postgres Schema)
├── frontend/                # React Dashboard (The Face)
│   ├── src/
│   │   ├── components/      # Reusable UI (GlassCard, NeonButton)
│   │   ├── pages/           # Auth & Dashboard Views
│   │   └── context/         # Auth State Management
│   └── vite.config.js       # Build Config
├── scraper/                 # Python Scripts (The Muscle)
│   ├── main_scraper.py      # The Logic
│   └── requirements.txt     # Python Dependencies
├── docker/                  # Infrastructure as Code
│   ├── php/                 # Custom Hybrid Dockerfile
│   └── nginx/               # Web Server Config
├── docker-compose.yml       # Orchestrator
└── start-dev.ps1            # Developer Startup Script
```

---

## 6. How to Run (Cheat Sheet)

### Quick Start (PowerShell)

We have provided a unified script to start the entire stack:

```powershell
./start-dev.ps1
```

### Manual Startup

**1. Start the Backend Infrastructure:**

```powershell
docker-compose up -d
```

**2. Start the Frontend Dev Server:**

```powershell
cd frontend
npm run dev
```

### Access Points

- **Dashboard:** [http://localhost:5173](http://localhost:5173)
- **API Endpoint:** `POST http://localhost:8000/api/v1/jobs`
- **Database:** `localhost:5433` (User: `root`, Pass: `password`)

---

## 7. Developer Notes

### Checking Background Jobs

To see the scraper in action, view the queue logs:

```powershell
docker-compose logs -f queue
```

### Database Management

Connect via TablePlus/DBeaver or use CLI:

```powershell
docker-compose exec db psql -U root -d spectraflow
```
