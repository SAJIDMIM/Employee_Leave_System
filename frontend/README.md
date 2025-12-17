# Employee Leave Management System

A simple **Employee Leave Management System** built with a **React frontend** and **Node.js / Express backend**.  
Employees can apply for leave, and Admins can review, approve, or reject leave requests.

This project focuses on **core functionality, clean architecture, and backend–frontend integration**, rather than complex UI design.

---

## Features

### 👤 Employee
- Login / Logout using email and password
- Apply for leave with start date, end date, and reason
- View history of submitted leave requests
- Track leave status (Pending / Approved / Rejected)

### 🛡️ Admin
- Login / Logout
- View all pending leave requests
- Approve or reject leave requests
- Automatic audit logging for approvals and rejections *(Bonus feature)*

### ⚙️ System
- JWT-based authentication and authorization
- Role-based access control (Admin / Employee)
- Input validation using `express-validator`
- Secure password hashing using bcrypt
- RESTful API design
- Simple UI using plain CSS / Bootstrap

---

## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JSON Web Tokens (JWT)
- **Validation:** express-validator
- **Styling:** Plain CSS / Bootstrap

---

## Folder Structure

```text
/frontend        → React frontend
/backend         → Node.js backend
  ├─ controllers → Business logic
  ├─ middleware  → Auth & validation middleware
  ├─ models      → Mongoose schemas
  ├─ routes      → API routes
  ├─ config      → Configuration files
  ├─ server.js   → Application entry point
.env              → Environment variables (not committed)


Dependencies
Backend Dependencies (/backend)

Install all required backend dependencies:

npm install express mongoose dotenv jsonwebtoken bcryptjs cors express-validator


Install development dependency:

npm install --save-dev nodemon


Backend Packages Used

express – Web framework

mongoose – MongoDB ODM

dotenv – Environment variable management

jsonwebtoken – JWT authentication

bcryptjs – Password hashing

cors – Cross-origin requests

express-validator – Request validation

nodemon – Auto-restart server during development

Frontend Dependencies (/frontend)

Install frontend dependencies:

npm install


Or manually install core dependencies:

npm install react react-dom react-router-dom axios


Frontend Packages Used

react – UI library

react-dom – DOM rendering

react-router-dom – Routing

axios – API requests

Setup Instructions
1️⃣ Clone the Repository
git clone <your-repo-url>
cd <project-folder>

2️⃣ Backend Setup
cd backend
npm install


Create a .env file inside the backend folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_EMAILS=admin@example.com


Start the backend server:

npm run dev


Backend runs on:
http://localhost:5000

3️⃣ Frontend Setup
cd ../frontend
npm install


Create a .env file inside the frontend folder:

REACT_APP_API_URL=http://localhost:5000/api


Start the frontend application:

npm start


Frontend runs on:
http://localhost:3000

Admin Account Setup

Admin users are automatically created and assigned if the login email matches the value in the ADMIN_EMAILS variable inside the backend .env file.

Example Admin Credentials

Email: admin@example.com

Password: Any password used during login

If the admin email does not exist in the database, it will be created automatically on first login.

API Endpoints
Authentication
Method	Endpoint	Description
POST	/api/auth/login-or-create	Login or auto-create user
GET	/api/health	API health check
Leave Management
Method	Endpoint	Role	Description
POST	/api/leaves	Employee	Apply for leave
GET	/api/leaves/my-leaves	Employee	View own leave requests
GET	/api/leaves/all	Admin	View all leave requests
PUT	/api/leaves/:id/status	Admin	Approve or reject leave
Usage Flow

User logs in using email and password

JWT token is generated and stored in localStorage

Employee submits a leave request

Admin reviews pending leave requests

Admin approves or rejects the request

Audit log is recorded for admin actions

Validation & Security

Request validation using express-validator

Password hashing using bcryptjs

JWT-based route protection

Role-based access control middleware

Advanced / Bonus Features

Audit logging for admin approvals and rejections
(Example: "Admin X approved leave Y at [timestamp]")

Centralized error handling

Clean separation of concerns

Submission Notes

Public GitHub repository

Clean /backend and /frontend folder structure

.env files excluded from version control

Admin setup instructions included

Focused on functionality and data integration

Future Enhancements

Email notifications

File uploads for leave documents

Dashboard analytics

Improved UI/UX design

© 2024 Employee Leave Management System