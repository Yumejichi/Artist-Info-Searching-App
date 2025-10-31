# Artist Info Searching App 🎨

[![Angular](https://img.shields.io/badge/Angular-16-red.svg)](https://angular.io/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

A full-stack web application for searching and exploring artist information using the Artsy API. Users can search for artists, view detailed artist profiles, browse artworks, and save their favorite artists.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Deployment](#-deployment)
- [Usage](#-usage)
- [Contributing](#-contributing)
- [License](#-license)

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

## 🔧 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) - Node Package Manager
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) (local) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud)
- **Artsy API Credentials** - Client ID and Client Secret (see setup below)

## ⚙️ Environment Variables Setup

### Backend Configuration

Create a `.env` file in the `backend/` directory with the following variables:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
ARTSY_TOKEN_CLIENTID=your_artsy_client_id
ARTSY_TOKEN_CLIENTSECRET=your_artsy_client_secret
JWT_SECRET=your_jwt_secret_key
```

### Getting Artsy API Credentials

1. Visit https://developers.artsy.net/
2. Create an account and register your application
3. Obtain your Client ID and Client Secret
4. Add them to your `.env` file

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/Yumejichi/Artist-Info-Searching-App.git
cd Artist-Info-Searching-App
```

2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

## 🚀 Running the Application

There are two ways to run this application:

### Option 1: Production Mode (Recommended for Deployment)

This runs both frontend and backend together. The backend serves the built frontend files.

1. Build the frontend:

```bash
cd frontend
npm run build
```

2. Copy the built files to backend public directory:

```bash
# The build output should be copied to backend/public/
# (This may already be done if deploying)
```

3. Start the backend server:

```bash
cd ../backend
npm start
```

4. Open your browser and navigate to: `http://localhost:3000`

### Option 2: Development Mode

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

3. Configure the frontend proxy (already configured in `proxy.conf.json`) to forward API requests to the backend.

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

## 💻 Usage

1. **Search for Artists**: Use the search bar on the home page to find artists
2. **View Artist Details**: Click on any artist to see their profile, biography, and artworks
3. **Register/Login**: Create an account or login to save favorite artists
4. **Save Favorites**: While logged in, click the favorite button on artist pages
5. **Manage Favorites**: Visit the Favorites page to view and remove saved artists

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- [Artsy API](https://developers.artsy.net/) for providing artist and artwork data
- Angular and Express.js communities for excellent documentation and support

## 📞 Support

If you encounter any issues or have questions, please open an issue on the [GitHub repository](https://github.com/Yumejichi/Artist-Info-Searching-App).
