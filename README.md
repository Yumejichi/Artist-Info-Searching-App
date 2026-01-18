# Artist Info Searching App 🎨

[![Angular](https://img.shields.io/badge/Angular-16-red.svg)](https://angular.io/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen.svg)](https://www.mongodb.com/)

## About

A full-stack web application for searching and exploring artist information using the Artsy API. This application demonstrates my skills in building modern web applications with Angular frontend, Node.js/Express backend, and MongoDB database integration.
- **[Web Link](https://artist-info-searching-app.wl.r.appspot.com/search)** - Deployed on Google Cloud Platform

**Key Highlights:**

- RESTful API design with Express.js
- JWT-based authentication system
- Integration with external API (Artsy)
- Responsive UI with Angular and Bootstrap
- User favorites management system

## 📋 Table of Contents

- [About](#about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#getting-started)
- [Running the Application](#-running-the-application)
- [How to Use](#how-to-use)
- [API Endpoints](#-api-endpoints)
- [Deployment](#-deployment)

## ✨ Features

- **Artist Search**: Search for artists using the Artsy API
- **Artist Details**: View comprehensive information about artists including biography, artwork, and career highlights
- **Artwork Gallery**: Browse through artist's artworks with detailed information
- **Favorites System**: Save and manage your favorite artists (requires authentication)
- **User Authentication**: Secure user registration and login system
- **User Profile**: Access your account information and favorite artists

## 🔧 Tech Stack

### Frontend

- **Framework**: Angular 16
- **Styling**: Bootstrap 5
- **Language**: TypeScript

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) with bcrypt for password hashing
- **API Integration**: Artsy API

## 📁 Project Structure

```
Artist-Info-Searching-App/
├── backend/           # Node.js/Express backend server
│   ├── models/        # MongoDB models (User, Favorite)
│   ├── routes/        # API routes (login, register, artsy, etc.)
│   ├── middleware/    # Authentication middleware
│   ├── public/        # Built frontend files (for production)
│   └── index.js       # Main server file
└── frontend/          # Angular frontend application
    ├── src/
    │   ├── app/
    │   │   ├── search/           # Artist search component
    │   │   ├── favorites/        # Favorites management
    │   │   ├── authentication/   # Login & Register
    │   │   └── services/         # API services
    └── dist/          # Production build output
```

## Getting Started

### Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Artsy API Credentials** - Register at [developers.artsy.net](https://developers.artsy.net/) to get Client ID and Secret

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Yumejichi/Artist-Info-Searching-App.git
cd Artist-Info-Searching-App
```

2. Install dependencies:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Set up environment variables:

Create a `.env` file in the `backend/` directory:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
ARTSY_TOKEN_CLIENTID=your_artsy_client_id
ARTSY_TOKEN_CLIENTSECRET=your_artsy_client_secret
JWT_SECRET=your_jwt_secret_key
```

## 🚀 Running the Application

### Development Mode (Recommended for Testing)

Run frontend and backend separately for development with hot-reload:

1. Start the backend server:

```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

Backend will run on: `http://localhost:3000`

2. In a new terminal, start the frontend development server:

```bash
cd frontend
npm start
```

Frontend will run on: `http://localhost:4200`

The frontend proxy is already configured in `proxy.conf.json` to forward API requests to the backend.

### Production Mode

To run in production mode (backend serves built frontend files):

1. Build the frontend:

```bash
cd frontend
npm run build
```

2. Copy build output to `backend/public/` (if not already there)

3. Start the backend:

```bash
cd ../backend
npm start
```

The application will be available at `http://localhost:3000`

## 📡 API Endpoints

### Authentication

| Method | Endpoint        | Description                  |
| ------ | --------------- | ---------------------------- |
| `POST` | `/api/register` | Register a new user          |
| `POST` | `/api/login`    | User login                   |
| `POST` | `/api/logout`   | User logout                  |
| `GET`  | `/api/me`       | Get current user information |

### Artsy API Proxy

| Method | Endpoint                | Description         |
| ------ | ----------------------- | ------------------- |
| `GET`  | `/api/artsy/search`     | Search for artists  |
| `GET`  | `/api/artsy/artist/:id` | Get artist details  |
| `GET`  | `/api/artsy/artworks`   | Get artist artworks |

### Favorites (Protected Routes)

| Method   | Endpoint             | Description                  |
| -------- | -------------------- | ---------------------------- |
| `POST`   | `/api/favorites`     | Add artist to favorites      |
| `GET`    | `/api/favorites`     | Get user's favorites         |
| `DELETE` | `/api/favorites/:id` | Remove artist from favorites |

## 🚢 Deployment

### Backend Deployment (Google App Engine)

The backend is configured for Google App Engine deployment with `app.yaml`.

1. Install Google Cloud SDK
2. Configure your project:

```bash
gcloud config set project YOUR_PROJECT_ID
```

3. Deploy:

```bash
cd backend
gcloud app deploy
```

The backend serves the built frontend files from the `public/` directory, so both frontend and backend are deployed together.

## How to Use

Once the application is running:

1. **Search for Artists**: Use the search bar on the home page to find artists by name
2. **View Artist Details**: Click on any artist card to see their detailed profile, biography, and artwork gallery
3. **Register/Login**: Create a new account or login to enable favorites functionality
4. **Save Favorites**: While logged in, click the favorite button (❤️) on artist pages to save them
5. **Manage Favorites**: Visit the Favorites page from the navigation menu to view and manage your saved artists

### User Flow

```
Home → Search Artists → View Artist Details → (Optional) Save to Favorites → Manage Favorites
```

## 🙏 Acknowledgments

- [Artsy API](https://developers.artsy.net/) for providing artist and artwork data
