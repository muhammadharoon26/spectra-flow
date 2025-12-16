# SpectraFlow

SpectraFlow is a robust, containerized scraping engine extending **Laravel** with a specialized **Python** service. It leverages **Docker** for orchestration, **Redis** for asynchronous job queues, and **PostgreSQL** for scalable data storage.

## 🚀 Key Features

- **Hybrid Architecture**: Laravel API (Backend) + Python Scraper (Worker).
- **Asynchronous Processing**: Jobs are dispatched via Redis queues and processed in the background.
- **Dockerized**: Fully containerized environment for consistent development and deployment.
- **Scalable**: Built on Postgres and Redis for handling high volumes of data and jobs.

## 📂 Project Structure

SpectraFlow follows a **Monorepo** structure:

```
SpectraFlow/
├── backend/             # Laravel Application (API, Models, Jobs)
│   ├── app/
│   ├── routes/
│   └── ...
├── scraper/             # Python Scraper Service
│   ├── main_scraper.py  # Entry point
│   ├── requirements.txt # Python dependencies
│   └── venv/            # Virtual Environment (Auto-managed)
├── docker/              # Infrastructure Configuration
│   ├── nginx/
│   └── php/
└── docker-compose.yml   # Orchestration Config
```

## 🛠️ Tech Stack

- **Backend Framework**: Laravel 10+ (PHP 8.2)
- **Scraping Engine**: Python 3 (BeautifulSoup4, Requests)
- **Database**: PostgreSQL 15
- **Queue/Cache**: Redis
- **Web Server**: Nginx

## 🏁 Getting Started

### Prerequisites

- [Docker & Docker Compose](https://www.docker.com/products/docker-desktop) installed.

### Installation

1. **Clone the Repository**

   ```bash
   git clone <repository_url>
   cd SpectraFlow
   ```

2. **Environment Setup**
   Copy the example environment file for the backend:

   ```bash
   cp backend/.env.example backend/.env
   # Or create one manually if it doesn't exist
   ```

3. **Build & Start Containers**
   This command builds the images (installing PHP & Python dependencies) and starts the services.

   ```bash
   docker-compose up -d --build
   ```

4. **Run Migrations**
   Set up the database schema.
   ```bash
   docker-compose exec app php artisan migrate
   ```

## 🏃 Usage

### 1. Check Service Status

**GET** `http://localhost:8000/api/v1/status`
_(Note: Ensure you have a route defined for this in `backend/routes/api.php`)_

### 2. Dispatch a Scrape Job

**POST** `http://localhost:8000/api/v1/jobs`

```json
{
  "url": "https://example.com",
  "type": "generic"
}
```

### 3. Check Job Status

**GET** `http://localhost:8000/api/v1/jobs/{job_id}`

## 🔧 Commands

- **Access App Container**: `docker-compose exec app bash`
- **View Logs**: `docker-compose logs -f`
- **Process Queues (Manual)**: The `queue` service runs this automatically, but you can inspect it via:
  ```bash
  docker-compose logs -f queue
  ```
