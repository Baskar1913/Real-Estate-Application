# Real Estate Properties — Full-stack project

A dynamic real-estate portal based on the supplied UI reference.

## Included

- Django 5.2 REST API and Swagger
- PostgreSQL configuration through `.env`
- Nine requested content models plus dynamic Contact Information
- Secure Django users with token authentication
- Login, create account, logout, forgot password and reset password
- Public Home page with centered User/Admin authentication popup for protected navigation
- Shared responsive user/admin interface
- Users can view and use the portal
- Staff administrators can create, read, update and delete every content resource
- Contact phone, email, address and map link are editable from React **Manage → Contact Details**
- React 19 + TypeScript + Vite frontend
- Image upload and media serving in development
- Backend tests and frontend production build

No passwords or demo credentials are included.

## 1. PostgreSQL database

Open pgAdmin, connect to your PostgreSQL server, right-click **Databases**, select **Create → Database**, and use:

```text
Database: realestate_db
Owner: postgres
```

Alternatively, in PostgreSQL Query Tool:

```sql
CREATE DATABASE realestate_db;
```

## 2. Backend setup on Windows

Open PowerShell in the extracted project:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Open `backend\.env` and set your actual PostgreSQL values:

```env
DJANGO_SECRET_KEY=replace-with-a-long-random-secret
DEBUG=True
DB_NAME=realestate_db
DB_USER=postgres
DB_PASSWORD=your-actual-postgresql-password
DB_HOST=localhost
DB_PORT=5432
FRONTEND_URL=http://localhost:5173
USE_SQLITE=False
```

Never commit or share `.env`.

Run migrations and create the administrator:

```powershell
python manage.py check
python manage.py migrate
python manage.py createsuperuser
```

Use an `@ssintern.in` email for the superuser. The custom administrator login rejects every other email domain, and public registration always creates a normal user.

Optional starter content:

```powershell
python manage.py seed_content
```

This creates a complete optional South Indian demo portfolio with coordinated original images, About content, categories, subcategories, locations, six properties, three projects, amenities and contact details. It never creates login credentials. The About banner also controls the Home hero image and can be replaced from **Manage → About Us**.

The Properties, Projects and Contact Us pages include distinct panoramic header banners by default. Their frontend assets are stored in `frontend/public/banners/`; replace an image while keeping its filename to change that page banner without a database migration.

Start Django:

```powershell
python manage.py runserver
```

Backend URLs:

- API home: `http://127.0.0.1:8000/`
- Swagger: `http://127.0.0.1:8000/api/docs/`
- Django Admin: `http://127.0.0.1:8000/admin/`

Forgot Password uses a two-step development flow: first enter and verify the registered email; then enter and confirm the new password and click **Reset password**. No email link is generated.

## 3. Frontend setup

Open a second PowerShell terminal:

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Open `http://localhost:5173`.

The frontend `.env` defaults are:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_BACKEND_URL=http://127.0.0.1:8000
```

## Roles

- Normal account: created through **Create account**; can browse and submit enquiries.
- Admin account: provisioned internally with `python manage.py createsuperuser` using an `@ssintern.in` email; receives the **Manage** navigation and all CRUD controls. Public admin account creation is disabled.
- The backend enforces these permissions. Hiding frontend buttons is not the security boundary.

The Home page is public. The far-right header account icon opens a dropdown containing only **User** and **Admin**. Each choice opens a centered role-specific window. User login includes Create Account and Forgot Password; Admin login includes Forgot Password only. Opening About, Properties, Projects, Contact, detail pages, or management while signed out returns to Home and opens the user login window. Category selection filters the available subcategories in Home search, listing filters, and admin Property/Project forms. Contact edits refresh the footer immediately, and the Contact page displays the map URL as a matching Location row.

## Verification

Backend:

```powershell
python manage.py test
```

Frontend:

```powershell
npm run lint
npm run build
```

## Existing-backend note

This ZIP is complete and can run independently. If you connect the frontend to an older backend, its endpoint names and serializer fields must match those in `backend/api/urls.py` and `backend/api/serializers.py`.
