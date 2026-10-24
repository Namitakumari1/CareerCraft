CareerCraft — AI Resume Builder & Job Application Tracker

CareerCraft is a full-stack MERN application designed to help job seekers manage their career journey in one place. Users can create professional resumes, track job applications, monitor application progress, and manage their account through a secure dashboard.

Features
Authentication and Authorization
User registration and login
Secure password hashing using bcrypt
JWT-based authentication
Protected frontend routes
Backend authentication middleware
Role-based authorization for restricted routes
Profile management with name and email updates
Logout functionality
Resume Builder
Create and manage multiple resumes
Edit and save existing resumes
Select from available resume templates
Add personal information and a professional summary
Manage education, work experience, skills, projects, certifications, and achievements
Live resume preview
Print or save resumes as PDF
Save resume data to MongoDB
Job Application Tracker
Add, view, update, and delete job applications
Track application statuses, including Wishlist, Applied, Interview, Offer, and Rejected
Store company names, job titles, locations, and job URLs
Track application dates and interview dates
Add salary details and notes
Search and filter applications
Paginate application results
Dashboard
View total resumes and job applications
Monitor application progress by status
View upcoming interviews
Track offers received
Review recent job applications
Profile Management
View account information
Update name and email address
Validate profile updates on the backend
Tech Stack
Frontend
React
Vite
React Router
JavaScript (ES6+)
HTML5
CSS3
React Icons
Backend
Node.js
Express.js
REST APIs
JavaScript (ES modules)
Database
MongoDB Atlas
Mongoose
Authentication and Security
JSON Web Tokens (JWT)
bcrypt
Authentication middleware
Role-based authorization
Protected API routes
Development and Deployment
Git and GitHub
Vite production build
Render for backend deployment
Vercel for frontend deployment
Project Structure
CareerCraft/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Home/
│   │   │   ├── Register/
│   │   │   ├── Login/
│   │   │   ├── Dashboard/
│   │   │   ├── ResumeBuilder/
│   │   │   ├── Applications/
│   │   │   └── Profile/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── .gitignore
└── README.md

Note: This structure shows the main project areas. Your actual folders and files may differ slightly.

Prerequisites

Before running CareerCraft locally, install:

Node.js
npm, included with Node.js
Git
A MongoDB Atlas account or another MongoDB instance
Installation and Setup
1. Clone the Repository
git clone https://github.com/Namitakumari1/CareerCraft
cd CareerCraft

Replace YOUR_GITHUB_REPOSITORY_URL with your actual GitHub repository URL.

2. Configure the Backend

Navigate to the server directory:

cd server
npm install

Create a .env file inside the server directory:

PORT=7000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret

Replace the example values with your actual configuration.

PORT: The local backend port. The application currently uses port 7000 for local development.
MONGO_URI: Your MongoDB connection string, including the intended database name.
JWT_SECRET: A long, random, private secret used to sign and verify JWTs.

Security: Never commit your .env file, database credentials, or JWT secret to GitHub. Keep secrets on the backend only.

3. Start the Backend

From the server directory, run:

npm start

The backend should start on the configured local port, and the terminal should report a successful MongoDB connection.

The API root endpoint is:

http://localhost:7000/
4. Configure the Frontend

Open a second terminal and navigate to the client directory:

cd client
npm install

Create or update client/.env:

VITE_API_URL=http://localhost:7000/api

This environment variable tells the React frontend where to send API requests during local development.

Restart the frontend development server whenever you change its environment variables.

5. Start the Frontend

From the client directory, run:

npm run dev

Open the local URL printed by Vite in your browser. In the current development setup, the frontend runs at:

http://localhost:5174
Running the Application
Start MongoDB access and the backend server.
Start the Vite frontend server in a separate terminal.
Register a new account or log in.
Open the dashboard.
Create and manage resumes.
Add and update job applications.
Review dashboard statistics and upcoming interviews.
Visit the profile page to update account details.
Log out and verify that protected pages require authentication.
Environment Variables
Backend — server/.env
Variable	Purpose
PORT	Local server port; currently 7000
MONGO_URI	MongoDB connection string
JWT_SECRET	Private signing secret for JWT authentication
Frontend — client/.env
Variable	Purpose
VITE_API_URL	Base URL of the backend API, ending in /api

For deployment, configure production environment variables in the hosting providers' dashboards. Do not use the local development URL in the deployed frontend.

Production Build

To create an optimized frontend production build, run:

cd client
npm run build

Vite generates the production files in:

client/dist/

To test the production build locally, run:

npm run preview

The preview server is intended for local testing, not as the production hosting server.

Deployment

CareerCraft is planned for deployment using Vercel for the frontend and Render for the backend, with MongoDB Atlas as the database.

Backend — Render
Push the project to GitHub.
Create a new Web Service on Render and connect the repository.
Configure the backend root directory as server if required by the repository setup.
Set the build command to npm install.
Set the start command to npm start.
Add the required environment variables:
MONGO_URI
JWT_SECRET
Configure the backend CORS policy to allow requests from the deployed frontend origin.
Deploy the service and verify that its root endpoint returns a successful API response.

Render provides the production port through the PORT environment variable. The server should listen on process.env.PORT.

Frontend — Vercel
Create a new Vercel project and connect the GitHub repository.
Set the project root directory to client.
Use npm run build as the build command.
Use dist as the output directory.
Set the production environment variable:
VITE_API_URL=https://YOUR_RENDER_BACKEND_URL/api

Replace the placeholder with the actual deployed backend URL.

Configure a Vercel rewrite or equivalent SPA fallback so refreshing routes such as /dashboard, /applications, /resume-builder, and /profile serves the React application.
Deploy and test the production application.

Important: The deployed frontend must use the deployed backend URL, not localhost. Ensure the MongoDB Atlas network access rules permit the backend to connect.

Security Considerations
Passwords are hashed before being stored.
JWTs are used to authenticate protected API requests.
Protected frontend routes improve navigation security, while backend middleware enforces actual API access control.
User-specific resources should be checked for ownership in the backend.
Database credentials and signing secrets must remain private.
Production CORS settings should allow only the intended frontend origins.
Never expose private backend environment variables through frontend code.
Future Enhancements

Potential future improvements include:

AI-assisted resume writing and improvement suggestions
Resume content suggestions tailored to job descriptions
Additional resume templates
Enhanced job application analytics
Application reminders and notifications

These are possible future enhancements and are not necessarily implemented in the current version.

Author

Namita Kumari

Full-stack MERN project built to simplify resume creation and job application tracking.

GitHub: Namitakumari1
Project: CareerCraft

License

No open-source license has been specified for this project.
