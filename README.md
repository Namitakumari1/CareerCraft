# CareerCraft — AI Resume Builder & Job Application Tracker

CareerCraft is a full-stack MERN application designed to help job seekers manage their career journey in one place. Users can create professional resumes, track job applications, monitor application progress, and manage their accounts through a secure dashboard.

## Features

### Authentication and Authorization

* User registration and login
* Password hashing using bcrypt
* JWT-based authentication
* Protected frontend routes
* Backend authentication middleware
* Role-based authorization for restricted routes
* Profile management with name and email updates
* Logout functionality

### Resume Builder

* Create and manage multiple resumes
* Edit and save existing resumes
* Choose from available resume templates
* Add personal information and a professional summary
* Manage education, work experience, skills, projects, certifications, and achievements
* Preview resumes while editing
* Print or save resumes as PDF
* Store resume data in MongoDB

### Job Application Tracker

* Add, view, update, and delete job applications
* Track application statuses: Wishlist, Applied, Interview, Offer, and Rejected
* Store company names, job titles, locations, and job URLs
* Track application and interview dates
* Add salary details and notes
* Search and filter applications
* Paginate application results

### Dashboard

* View total resumes and job applications
* Monitor application progress by status
* View upcoming interviews
* Track offers received
* Review recent job applications

### Profile Management

* View account information
* Update name and email address
* Validate profile updates on the backend

## Tech Stack

| Category           | Technologies                                                     |
| ------------------ | ---------------------------------------------------------------- |
| Frontend           | React, Vite, React Router, JavaScript, HTML5, CSS3, React Icons  |
| Backend            | Node.js, Express.js, REST APIs                                   |
| Database           | MongoDB Atlas, Mongoose                                          |
| Authentication     | JWT, bcrypt, authentication middleware, role-based authorization |
| Version Control    | Git, GitHub                                                      |
| Planned Deployment | Render (backend), Vercel (frontend)                              |

## Project Structure

```text
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
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   └── server.js
├── .gitignore
└── README.md
```

*Note: This is a simplified overview of the project structure. Some files and folders may be omitted.*

## Prerequisites

Before running CareerCraft locally, install:

* [Node.js](https://nodejs.org/)
* npm (included with Node.js)
* [Git](https://git-scm.com/)
* A [MongoDB Atlas](https://www.mongodb.com/atlas) account or another MongoDB instance

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Namitakumari1/CareerCraft.git
cd CareerCraft
```

### 2. Configure the Backend

Navigate to the backend directory and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=7000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

Replace the example values with your actual configuration.

* `PORT`: Local backend port. The current local setup uses port `7000`.
* `MONGO_URI`: Your MongoDB connection string, including the intended database name.
* `JWT_SECRET`: A long, random, private secret used to sign and verify JWTs.

**Security:** Never commit your `.env` file, database credentials, or JWT secret to GitHub. Keep backend secrets private.

### 3. Start the Backend

From the `server` directory, run:

```bash
npm start
```

The backend should start on the configured port and connect to MongoDB.

Test the API root endpoint at:

```text
http://localhost:7000/
```

### 4. Configure the Frontend

Open a second terminal from the project root and navigate to the frontend directory:

```bash
cd client
npm install
```

Create or update `client/.env`:

```env
VITE_API_URL=http://localhost:7000/api
```

This variable tells the frontend where to send API requests during local development.

Restart the frontend development server after changing environment variables.

### 5. Start the Frontend

From the `client` directory, run:

```bash
npm run dev
```

Open the local URL printed by Vite. In the current development setup, it is:

```text
http://localhost:5174
```

## Running the Application

1. Start the backend server and ensure MongoDB is accessible.
2. Start the frontend development server in a separate terminal.
3. Register an account or log in.
4. Open the dashboard.
5. Create and manage resumes.
6. Add and update job applications.
7. Review dashboard statistics and upcoming interviews.
8. Visit the profile page to update account details.
9. Log out and verify that protected pages require authentication.

## Environment Variables

### Backend — `server/.env`

| Variable     | Purpose                                       |
| ------------ | --------------------------------------------- |
| `PORT`       | Local server port; currently `7000`           |
| `MONGO_URI`  | MongoDB connection string                     |
| `JWT_SECRET` | Private signing secret for JWT authentication |

### Frontend — `client/.env`

| Variable       | Purpose                                       |
| -------------- | --------------------------------------------- |
| `VITE_API_URL` | Base URL of the backend API, ending in `/api` |

For deployment, configure environment variables through the hosting providers' dashboards. The deployed frontend must use the deployed backend URL instead of `localhost`.

## Production Build

To create an optimized frontend production build:

```bash
cd client
npm run build
```

Vite generates the production files in:

```text
client/dist/
```

To preview the production build locally:

```bash
npm run preview
```

The preview server is intended for local testing, not as the production hosting server.

## Deployment

CareerCraft is intended to be deployed using **Render for the backend**, **Vercel for the frontend**, and **MongoDB Atlas for the database**.

### Backend — Render

1. Push the project to GitHub.
2. Create a new Web Service on Render and connect the repository.
3. Set the root directory to `server`.
4. Set the build command to `npm install`.
5. Set the start command to `npm start`.
6. Configure the required environment variables:

   * `MONGO_URI`
   * `JWT_SECRET`
7. Ensure the backend listens on `process.env.PORT`.
8. Configure CORS to allow requests from the deployed frontend origin.
9. Deploy the service and verify that its root endpoint returns a successful API response.

Render supplies the production port through the `PORT` environment variable. Do not hardcode the production port.

### Frontend — Vercel

1. Create a new Vercel project and connect the GitHub repository.

2. Set the project root directory to `client`.

3. Set the build command to `npm run build`.

4. Set the output directory to `dist`.

5. Configure this production environment variable:

   ```env
   VITE_API_URL=https://YOUR_RENDER_BACKEND_URL/api
   ```

   Replace the placeholder with your actual Render backend URL.

6. Configure an SPA fallback so refreshing routes such as `/dashboard`, `/applications`, `/resume-builder`, and `/profile` serves the React application.

7. Deploy the frontend and test the complete application.

**Important:** The deployed frontend must use the deployed backend URL, not `localhost`. Ensure MongoDB Atlas network access rules allow the backend to connect.

## Security Considerations

* Passwords are hashed before being stored.
* JWTs authenticate protected API requests.
* Frontend route protection improves navigation, while backend middleware enforces API access control.
* Backend controllers should verify that users can access only their own resumes and job applications.
* Database credentials and signing secrets must remain private.
* Production CORS settings should allow only the intended frontend origins.
* Never expose private backend environment variables through frontend code.

## Future Enhancements

Potential future improvements include:

* AI-assisted resume writing and improvement suggestions
* Resume suggestions tailored to job descriptions
* Additional resume templates
* Enhanced job application analytics
* Application reminders and notifications

These are potential enhancements and are not necessarily implemented in the current version.

## Author

**Namita Kumari**

CareerCraft is a full-stack MERN project focused on resume creation and job application management.

* GitHub: [Namitakumari1](https://github.com/Namitakumari1)
* Repository: [CareerCraft](https://github.com/Namitakumari1/CareerCraft)

## License

No open-source license has been specified for this project yet.
