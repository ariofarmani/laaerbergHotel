# Laaerberg Apart Hotel

A modern web application for the Laaerberg Apart Hotel, featuring apartment listings, reservations, and admin management.

## 🏨 Project Overview

This project consists of two main parts:
- **Frontend**: React application built with TypeScript, React Router, Tailwind CSS
- **Backend**: Node.js API using Express, DuckDB (in-memory database), and JWT authentication

## 🚀 Running Locally

### Backend Setup

1. Install dependencies:
   ```
   cd backend
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```
   The backend will run on http://localhost:5000

### Frontend Setup

1. Install dependencies:
   ```
   cd frontend
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```
   The frontend will run on http://localhost:3000

## 📱 Features

- 🏠 **Home page**: Hotel information and promotional content
- 🏨 **Apartments page**: Listing of available apartments
- 🛌 **Apartment Detail page**: Detailed view of each apartment
- 📅 **Reservation system**: Book apartments with date selection
- 📝 **Contact page**: Contact form for inquiries
- 👨‍💼 **Admin Dashboard**: Manage reservations and apartments
- 🔐 **Authentication**: User and admin login

## 🌐 GitHub Pages Deployment

The frontend is deployed on GitHub Pages and available at:
https://ariofarmani.github.io/laaerbergHotel

To deploy updates to GitHub Pages:

1. Clone the repository:
   ```
   git clone https://github.com/ariofarmani/laaerbergHotel.git
   cd laaerbergHotel/frontend
   ```

2. Install dependencies and deploy:
   ```
   npm install
   npm run deploy
   ```

> **Note**: The GitHub Pages deployment uses mock data since GitHub Pages cannot host the backend server. For full functionality, deploy the backend to a service like Heroku, Render, or Railway.

## 🔧 Backend Deployment

For a complete working application, the backend needs to be deployed to a service that can run Node.js applications:

1. Create an account on a hosting platform like [Render](https://render.com), [Heroku](https://heroku.com), or [Railway](https://railway.app)
   
2. Follow their documentation to deploy the Node.js application from the `backend` folder

3. Once deployed, update the API URL in `frontend/src/utils/api.ts` with your backend URL

## 🔑 Admin Access

For testing the admin features:
- Email: admin@laaerberghotel.com
- Password: admin123

## 📚 Tech Stack

- **Frontend**:
  - React with TypeScript
  - React Router for navigation
  - Tailwind CSS for styling
  - Formik & Yup for form validation
  - React-i18next for internationalization
  - Axios for API calls

- **Backend**:
  - Node.js with Express
  - DuckDB for database
  - JWT for authentication
  - bcrypt for password hashing