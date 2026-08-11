# Real Estate Application

## About the Project

The Real Estate Application is a full-stack web application developed to manage and explore residential and commercial properties. It provides public pages for viewing properties, projects, company information, and contact details. Registered users can authenticate securely, while administrators can manage the real-estate data displayed on the website. The application uses Django REST Framework to provide REST APIs, React with TypeScript for the user interface, and PostgreSQL for permanent data storage.

## Explore the UI

[View the deployed application](https://real-estate-application-g746rcbci-baskar-ms-projects.vercel.app/)

## Features

- User registration, login, logout, and password reset
- Role-based access for customers and administrators
- Property and project listings with detailed information
- Management of categories, subcategories, locations, and amenities
- About Us and Contact Us sections
- Image upload support for properties and projects
- Admin management interface
- REST API documentation using Swagger
- Responsive React user interface

## Tools and Technologies

| Layer | Technology |
| --- | --- |
| Frontend | React, TypeScript, Vite, HTML, CSS |
| API communication | Axios and HTTP REST APIs |
| Backend | Python, Django, Django REST Framework |
| Database | PostgreSQL |
| API documentation | drf-spectacular and Swagger UI |
| Authentication | Django authentication and token-based API access |
| Version control | Git and GitHub |

## Software Requirements

Install the following software before running the project:

- Python 3.13 or a compatible Python 3 version
- PostgreSQL and pgAdmin 4
- Node.js and npm
- Git
- Visual Studio Code or another code editor

Confirm that the required tools are installed:

```bash
python --version
pip --version
node --version
npm --version
git --version
```

## Project Structure

```text
Real-Estate-Application/
├── backend/
│   ├── api/
│   │   ├── migrations/
│   │   ├── admin.py
│   │   ├── models.py
│   │   ├── permissions.py
│   │   ├── serializers.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   ├── sample_media/
│   ├── .env.example
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.ts
├── .gitignore
└── README.md
```

## How the Application Is Connected

The React frontend sends HTTP requests through Axios to the Django REST API. Django receives each request, validates and processes the data, and communicates with PostgreSQL through Django's Object-Relational Mapper (ORM). The API returns a JSON response, which React uses to update the interface.

```text
React frontend → Axios/HTTP → Django REST API → Django ORM → PostgreSQL
```

During local development, the services use these addresses:

| Service | Local address |
| --- | --- |
| React frontend | `http://localhost:5173` |
| Django backend | `http://127.0.0.1:8000` |
| REST API | `http://127.0.0.1:8000/api/` |
| Swagger UI | `http://127.0.0.1:8000/api/docs/` |
| Django Admin | `http://127.0.0.1:8000/admin/` |
| PostgreSQL | `localhost:5432` |

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/Baskar1913/Real-Estate-Application.git
cd Real-Estate-Application
```

### 2. Create the PostgreSQL database

Open pgAdmin 4 or PostgreSQL Query Tool and execute:

```sql
CREATE DATABASE realestate_db;
```

Keep the PostgreSQL database name, username, password, host, and port available for the backend configuration.

### 3. Set up the Django backend

Open a terminal in the project root and enter the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows Command Prompt:

```cmd
.venv\Scripts\activate
```

For Windows PowerShell, use:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install the backend packages:

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Configure the backend environment

Create `backend/.env` by copying `backend/.env.example`:

```cmd
copy .env.example .env
```

Update `.env` with your local PostgreSQL information:

```env
DJANGO_SECRET_KEY=replace-with-a-long-random-secret-key
DEBUG=True
DB_NAME=realestate_db
DB_USER=postgres
DB_PASSWORD=your-postgresql-password
DB_HOST=localhost
DB_PORT=5432
FRONTEND_URL=http://localhost:5173
USE_SQLITE=False
```

Do not upload `.env` to GitHub. Only `.env.example` should be committed.

### 5. Apply database migrations

Run these commands from the `backend` folder while the virtual environment is active:

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create a Django administrator

```bash
python manage.py createsuperuser
```

Enter the requested username, email address, and password.

### 7. Test the backend configuration

```bash
python manage.py check
python manage.py test
```

### 8. Start the Django server

```bash
python manage.py runserver
```

The backend will run at `http://127.0.0.1:8000`.

### 9. Set up the React frontend

Keep the backend server running. Open a second terminal, return to the project root, and enter the frontend folder:

```bash
cd frontend
```

Install the frontend packages:

```bash
npm install
```

### 10. Configure the frontend environment

Create `frontend/.env` from the example file:

```cmd
copy .env.example .env
```

Ensure it contains:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_BACKEND_URL=http://127.0.0.1:8000
```

The first value connects Axios to the Django API. The second value is used when the frontend needs the backend base address, including media URLs.

### 11. Start the React development server

```bash
npm run dev
```

Open `http://localhost:5173` in the browser.

## Running the Project Later

Use two terminals whenever you run the project.

### Terminal 1 — Backend

```cmd
cd /d PATH_TO_PROJECT\Real-Estate-Application\backend
.venv\Scripts\activate
python manage.py runserver
```

### Terminal 2 — Frontend

```cmd
cd /d PATH_TO_PROJECT\Real-Estate-Application\frontend
npm run dev
```

Replace `PATH_TO_PROJECT` with the actual folder location on your computer.

## Conclusion

This project demonstrates the development of a complete real-estate management platform using React, Django REST Framework, and PostgreSQL. React provides an interactive and responsive user experience, Django supplies secure APIs and business logic, and PostgreSQL stores structured application data permanently. The separation between frontend, backend, and database makes the application easier to maintain, test, extend, and deploy.
