# 📚 Elimu-Online Platform

Elimu-Online is a digital learning platform for Primary and High School students in Kenya. It provides categorized educational resources (Notes, Exams, E-Books, Lesson Plans, Schemes of Work) accessible via a secure login system. Admins can upload files to Google Cloud Storage, and users can view/download them based on access levels.

---

## 🚀 Project Structure

```
Elimu_Online/
├── client/          # Frontend - React (No JSX), Vite, TailwindCSS
├── server/          # Backend - Django, PostgreSQL, GCS
├── .env             # Environment variables
```

---

## ⚙️ Backend Setup (Django + PostgreSQL)

### 📁 Navigate to the backend folder
```bash
cd server
```

### 📦 Install dependencies
```bash
pipenv install
```

### 🐍 Activate the virtual environment
```bash
pipenv shell
```

### 🔧 Set the Django settings module
```bash
$env:DJANGO_SETTINGS_MODULE="elimu_backend.settings"
```

### 🔄 Apply migrations
```bash
python manage.py migrate
```

### ▶️ Run the backend server
```bash
python manage.py runserver
```

> The backend will be live at: http://127.0.0.1:8000/

---

## 🎨 Frontend Setup (Vite + TailwindCSS + JS)

### 📁 Navigate to the frontend folder
```bash
cd client
```

### 📦 Install frontend dependencies
```bash
npm install
```

### ▶️ Start the development server
```bash
npm run dev
```

> The frontend will be available at: http://localhost:5173/

---

## ☁️ File Storage

- Uploaded files are stored on **Google Cloud Storage**.
- Set your bucket name in `.env`:

```env
GS_BUCKET_NAME=elimu-online-resources-2025
```

---

## 🗃️ Environment Variables

Make sure your `.env` file (placed inside `server/`) includes:

```env
# Django
DJANGO_SETTINGS_MODULE=elimu_backend.settings
SECRET_KEY=your-secret-key
DEBUG=True

# PostgreSQL
DB_NAME=elimu_db
DB_USER=elimu_online_db_user
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432

# GCS
GS_BUCKET_NAME=elimu-online-resources-2025
```

---

## 🛠️ Technologies Used

- **Frontend:** Vite, Tailwind CSS, JavaScript (No JSX), HTML
- **Backend:** Django, PostgreSQL
- **Cloud Storage:** Google Cloud Storage (GCS)
- **Auth:** Token-based user authentication

---

## 🧑‍💻 Developed By

> Elimu-Online Development Team – 2025

---
