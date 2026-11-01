# 🏛️ CivicConnect - Full Stack Application

Welcome to **CivicConnect**! This folder is right on your Desktop and contains everything: the Spring Boot Backend, the React Frontend, and the database backup.

---

## 📁 What is in this folder?

* 📂 **`backend/`** : Spring Boot Java backend (with all models, controllers, routers, and pre-configured VS Code settings).
* 📂 **`frontend/`** : React 19 + Vite frontend (with modern civic theme, live auto-categorization preview, timeline tracking, and department officer portal).
* ⚡ **`start-civicconnect.bat`** : **One-click launcher!** Double-click this to start both Backend and Frontend simultaneously.
* 💻 **`CivicConnect.code-workspace`** : Double-click to open both Backend and Frontend side-by-side in Visual Studio Code.
* 💾 **`civicconnect_db_backup.sql`** : Safe backup copy of your MySQL database.

---

## 🚀 How to Run

### Method 1: Double-Click Launcher (Fastest)
1. Double-click **`start-civicconnect.bat`** in this folder.
2. Two windows will open (one for Backend, one for Frontend).
3. Open your browser and go to:
   * **Frontend UI**: [http://localhost:5173](http://localhost:5173)
   * **Backend API / Embedded UI**: [http://localhost:8080](http://localhost:8080)

---

### Method 2: Open in Visual Studio Code
1. Double-click **`CivicConnect.code-workspace`** (or open VS Code and choose **File > Open Workspace from File...**).
2. You will see both `backend` and `frontend` in your VS Code sidebar.
3. In the terminal:
   * For backend: go to `backend` folder and run `.\run.bat` (or press **F5**).
   * For frontend: go to `frontend` folder and run `.\run-frontend.bat`.
