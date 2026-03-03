# HR-Pulse 🚀

> Automated job offer analysis platform powered by Azure AI, FastAPI, and Next.js.

HR-Pulse helps recruiters analyze job offers, extract key skills using NLP, and predict competitive salary ranges using machine learning.

---

## 📐 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENT                           │
│                    Next.js (port 3000)                  │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP /api/*
┌───────────────────────▼─────────────────────────────────┐
│                      BACKEND                            │
│                  FastAPI (port 8000)                    │
│         Auth │ Jobs │ Predictor │ OpenTelemetry         │
└──────┬────────────────┬────────────────────┬────────────┘
       │                │                    │
┌──────▼──────┐ ┌───────▼───────┐ ┌─────────▼──────────┐
│  Azure SQL  │ │  Azure AI     │ │  Jaeger (port 16686)│
│  Database   │ │  Language/NER │ │  Traces & Monitoring│
└─────────────┘ └───────────────┘ └────────────────────┘
```

---

## 📁 Project Structure

```
hr-pulse/
├── 📁 .github
│   └── 📁 workflows
│       └── ⚙️ main.yml
├── 📁 .pytest_cache
│   ├── 📁 v
│   ├── ⚙️ .gitignore
│   ├── 📄 CACHEDIR.TAG
│   └── 📝 README.md
├── 📁 backend
│   ├── 📁 DATA
│   │   ├── 📄 dataset_with_skills.csv
│   │   └── 📄 jobs_dataset.csv
│   ├── 📁 app
│   │   ├── 📁 models
│   │   │   ├── 🐍 prediction.py
│   │   │   └── 🐍 user.py
│   │   ├── 📁 schemas
│   │   │   └── 🐍 user.py
│   │   ├── 📁 services
│   │   │   ├── 🐍 auth_service.py
│   │   │   └── 🐍 ml_service.py
│   │   ├── 🐍 __init__.py
│   │   ├── 🐍 db.py
│   │   ├── 🐍 ingestion.py
│   │   └── 🐍 main.py
│   ├── 🐳 Dockerfile
│   ├── 🐍 __init__.py
│   └── 🐍 run_ner_extraction.py
├── 📁 frontend
│   ├── 📁 public
│   │   └── 🖼️ hero-bg.jpg
│   ├── 📁 src
│   │   ├── 📁 assets
│   │   │   ├── 🖼️ image2.jpg
│   │   │   └── 🖼️ image3.jpg
│   │   ├── 📁 components
│   │   │   ├── 📁 layout
│   │   │   │   ├── 📄 DashboardLayout.tsx
│   │   │   │   ├── 📄 Header.tsx
│   │   │   │   └── 📄 Sidebar.tsx
│   │   │   └── 📁 ui
│   │   │       ├── 📄 accordion.tsx
│   │   │       ├── 📄 alert-dialog.tsx
│   │   │       ├── 📄 alert.tsx
│   │   │       ├── 📄 aspect-ratio.tsx
│   │   │       ├── 📄 avatar.tsx
│   │   │       ├── 📄 badge.tsx
│   │   │       ├── 📄 breadcrumb.tsx
│   │   │       ├── 📄 button-group.tsx
│   │   │       ├── 📄 button.tsx
│   │   │       ├── 📄 calendar.tsx
│   │   │       ├── 📄 card.tsx
│   │   │       ├── 📄 carousel.tsx
│   │   │       ├── 📄 chart.tsx
│   │   │       ├── 📄 checkbox.tsx
│   │   │       ├── 📄 collapsible.tsx
│   │   │       ├── 📄 command.tsx
│   │   │       ├── 📄 context-menu.tsx
│   │   │       ├── 📄 dialog.tsx
│   │   │       ├── 📄 drawer.tsx
│   │   │       ├── 📄 dropdown-menu.tsx
│   │   │       ├── 📄 empty.tsx
│   │   │       ├── 📄 field.tsx
│   │   │       ├── 📄 form.tsx
│   │   │       ├── 📄 hover-card.tsx
│   │   │       ├── 📄 input-group.tsx
│   │   │       ├── 📄 input-otp.tsx
│   │   │       ├── 📄 input.tsx
│   │   │       ├── 📄 item.tsx
│   │   │       ├── 📄 kbd.tsx
│   │   │       ├── 📄 label.tsx
│   │   │       ├── 📄 menubar.tsx
│   │   │       ├── 📄 navigation-menu.tsx
│   │   │       ├── 📄 pagination.tsx
│   │   │       ├── 📄 popover.tsx
│   │   │       ├── 📄 progress.tsx
│   │   │       ├── 📄 radio-group.tsx
│   │   │       ├── 📄 resizable.tsx
│   │   │       ├── 📄 scroll-area.tsx
│   │   │       ├── 📄 select.tsx
│   │   │       ├── 📄 separator.tsx
│   │   │       ├── 📄 sheet.tsx
│   │   │       ├── 📄 sidebar.tsx
│   │   │       ├── 📄 skeleton.tsx
│   │   │       ├── 📄 slider.tsx
│   │   │       ├── 📄 sonner.tsx
│   │   │       ├── 📄 spinner.tsx
│   │   │       ├── 📄 switch.tsx
│   │   │       ├── 📄 table.tsx
│   │   │       ├── 📄 tabs.tsx
│   │   │       ├── 📄 textarea.tsx
│   │   │       ├── 📄 toggle-group.tsx
│   │   │       ├── 📄 toggle.tsx
│   │   │       └── 📄 tooltip.tsx
│   │   ├── 📁 context
│   │   │   └── 📄 AuthContext.tsx
│   │   ├── 📁 hooks
│   │   │   └── 📄 use-mobile.ts
│   │   ├── 📁 lib
│   │   │   └── 📄 utils.ts
│   │   ├── 📁 pages
│   │   │   ├── 📄 AnalyticsPage.tsx
│   │   │   ├── 📄 DashboardPage.tsx
│   │   │   ├── 📄 JobsPage.tsx
│   │   │   ├── 📄 LandingPage.tsx
│   │   │   ├── 📄 LoginPage.tsx
│   │   │   ├── 📄 PredictorPage.tsx
│   │   │   ├── 📄 RegisterPage.tsx
│   │   │   ├── 📄 SearchPage.tsx
│   │   │   └── 📄 SettingsPage.tsx
│   │   ├── 📁 services
│   │   │   └── 📄 api.ts
│   │   ├── 📁 types
│   │   │   └── 📄 index.ts
│   │   ├── 🎨 App.css
│   │   ├── 📄 App.tsx
│   │   ├── 🎨 index.css
│   │   └── 📄 main.tsx
│   ├── 🐳 Dockerfile
│   ├── 📝 README.md
│   ├── ⚙️ components.json
│   ├── 📄 eslint.config.js
│   ├── 🌐 index.html
│   ├── 📝 info.md
│   ├── ⚙️ nginx.conf
│   ├── ⚙️ package-lock.json
│   ├── ⚙️ package.json
│   ├── 📄 postcss.config.js
│   ├── 📄 tailwind.config.js
│   ├── ⚙️ tsconfig.app.json
│   ├── ⚙️ tsconfig.json
│   ├── ⚙️ tsconfig.node.json
│   └── 📄 vite.config.ts
├── 📁 ml
│   ├── 📁 ml
│   │   └── 📁 models
│   │       └── 📄 salary_model.pkl
│   ├── 📁 models
│   │   └── 📄 salary_model.pkl
│   └── 📁 notebook
│       └── 📄 salary_predictor.ipynb
├── 📁 tests
│   ├── 🐍 __init__.py
│   ├── 🐍 conftest.py
│   └── 🐍 test_auth.py
├── ⚙️ .gitignore
├── 🐍 HR_Pulse_agent.py
├── 📝 README.md
└── ⚙️ docker-compose.yml
```

---

## ⚙️ Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [uv](https://docs.astral.sh/uv/) — Python package manager
- [Node.js 20+](https://nodejs.org/)
- [Terraform](https://www.terraform.io/) — for infrastructure provisioning
- Azure account with access to your Resource Group

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/KarimaChami/HR-Pulse.git
cd hr-pulse
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your Azure credentials:

```env
DATABASE_URL=mssql+pyodbc://<user>:<password>@sql-server-hr-pulse-2026.database.windows.net/db-karima-CH?driver=ODBC+Driver+18+for+SQL+Server
AZURE_LANGUAGE_ENDPOINT=https://<your-resource>.cognitiveservices.azure.com/
AZURE_LANGUAGE_KEY=<your-key>
SECRET_KEY=<your-jwt-secret>
MODEL_PATH=ml/models/salary_model.pkl
```

### 3. Launch with Docker Compose

```bash
docker compose up --build
```

| Service  | URL |
|----------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000/docs |
| Jaeger UI | http://localhost:16686 |

---

## 🏗️ Infrastructure (Terraform)

### Provision Azure resources

```bash
cd infrastructure/terraform
terraform init
terraform plan
terraform apply
```

This creates:
- Azure SQL Database (serverless, auto-pause after 15 min)
- Azure AI Language service for NER extraction

### Launch containers with Terraform Docker provider

```bash
# From the same terraform folder
terraform apply
```

---

## 🤖 Data Pipeline

### 1. Preprocess and ingest jobs data

```bash
uv run python backend/scripts/preprocessing.py
uv run python backend/scripts/ingest.py
```

### 2. Run NER extraction (Azure AI)

```bash
uv run python backend/scripts/Ner_extraction.py
```

### 3. Train salary prediction model

```bash
uv run python backend/scripts/train_model.py
```

---

## 🧪 Tests & Code Quality

### Run linting

```bash
uv run ruff check backend/
# Auto-fix:
uv run ruff check backend/ --fix
```

### Run unit tests

```bash
uv run pytest backend/tests/ -v
```

Tests cover:
- Salary parsing (`$137K-$171K` → `154000.0`)
- ML feature construction
- FastAPI endpoints (mocked DB)
- Salary prediction (mocked model)

---

## ⚡ CI/CD Pipeline (GitHub Actions)

Every push triggers 3 sequential jobs:

```
lint ──► test ──► docker-build
```

| Job | Tool | Purpose |
|-----|------|---------|
| Lint | Ruff | Enforce Python code standards |
| Test | Pytest | Run unit tests |
| Docker Build | Docker | Verify images build without errors |

---

## 📊 Observability (OpenTelemetry + Jaeger)

The backend is fully instrumented with OpenTelemetry:

- **FastAPI routes** — auto-traced (latency, errors)
- **SQL queries** — auto-traced via SQLAlchemy instrumentation
- **Azure AI calls** — manual spans with response time tracking
- **500 errors** — visible directly in Jaeger UI

Open Jaeger at **http://localhost:16686** and select `hr-pulse-backend` to visualize traces.

---

## 🔒 Security

- No secrets committed to git — all credentials via `.env`
- JWT authentication on all protected endpoints
- `.env` is listed in `.gitignore`

---

## 👤 Author

**karima chami** — HR-Pulse Project 2026