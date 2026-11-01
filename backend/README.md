# 🏛️ CivicConnect Backend

**CivicConnect** is a crowdsourced civic issue reporting and resolution platform connecting citizens with municipal authorities.

---

## 🚀 How to Open and Run in VS Code

### 1. Open in VS Code
Open VS Code and choose **File > Open Folder...**, then select this directory:
```
C:\Users\RAVITEJA\.gemini\antigravity\scratch\civic-connect-backend
```

### 2. Run the Backend
You can run it in any of the following three ways:

* **Method 1 (One-click F5 / Debugger)**:
  Press `F5` or go to the **Run & Debug** panel (Ctrl+Shift+D) and click **CivicConnect Backend**.
* **Method 2 (Terminal in VS Code)**:
  Open the VS Code integrated terminal (`Ctrl + \``) and run:
  ```powershell
  .\mvnw.cmd spring-boot:run
  ```
  *(or simply double-click `run.bat`)*
* **Method 3 (Spring Boot Dashboard)**:
  If you have the **Spring Boot Tools** extension installed, click **Run** from the Spring Boot Dashboard in the left sidebar.

The backend starts on `http://localhost:8080`.

---

## 🌐 Interactive Web Dashboard

Once the backend is running, open your web browser and visit:
👉 **[http://localhost:8080](http://localhost:8080)**

The dashboard includes:
1. **Citizen Portal**:
   * Register a new citizen (with secure BCrypt password hashing)
   * Login as a citizen
   * Report a complaint with **Live Rule-based Auto-Classification** (category, priority, and department route update in real-time as you type!)
   * View and monitor complaint statuses in real-time (`REPORTED`, `IN PROGRESS`, `RESOLVED`).
2. **Department Officer Portal**:
   * One-click login for municipal departments (e.g., `roads`, `sanitation`, `electrical`, `drainage`, etc. with password `1234`).
   * View all complaints assigned specifically to that department.
   * Update issue statuses (`IN PROGRESS`, `RESOLVED`) on the ground.
3. **REST API Documentation**: Complete specification of all endpoints.

---

## 🛠️ System Architecture & Established Logic

* **Auto Category Matching (`CategoryMatcher.java`)**:
  Identifies categories like Streetlight, Garbage, Pothole, Broken Footpath, Road Sign, Drainage, Open Manhole, Water Supply, Sewage, Stray Animals, etc.
* **Auto Priority Engine (`PriorityEngine.java`)**:
  Calculates urgency (`HIGH`, `MEDIUM`, `LOW`) based on danger keywords (e.g., *danger, accident, live wire, open manhole, fire*).
* **Dynamic Department Router (`DepartmentRouter.java`)**:
  Routes issues to the corresponding municipal department (Electrical, Roads, Sanitation, Drainage, Water Supply, Sewerage, Animal Control, Parks, Enforcement).
* **MySQL Database**:
  Connected to `civicconnect` on `localhost:3306` with tables: `departments`, `department_accounts`, `users`, and `issues`.
* **CORS Support (`CorsConfig.java`)**:
  Configured to support connections from any web, mobile, or external frontend framework.

---

## 📡 REST API Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health & service status |
| `POST` | `/api/users/register` | Register new citizen |
| `POST` | `/api/users/login` | Citizen login |
| `GET` | `/api/users/{id}` | Get citizen profile |
| `GET` | `/api/dashboard/stats` | System-wide KPI metrics (total, reported, in-progress, resolved, priority breakdown) |
| `GET` | `/api/dashboard/department/{deptId}` | Department-specific KPI metrics |
| `POST` | `/api/issues/preview` | Live test classification preview |
| `POST` | `/api/issues` | Report new complaint |
| `GET` | `/api/issues` | List complaints (supports filters) |
| `GET` | `/api/issues/{id}` | Get single complaint tracking info |
| `GET` | `/api/issues/user/{userId}` | Citizen's reported complaints |
| `GET` | `/api/issues/department/{deptId}`| Department's queue |
| `PUT` | `/api/issues/{id}/status` | Officer status update |
| `GET` | `/api/departments` | List all departments |
| `POST` | `/api/departments/login` | Department officer login |
