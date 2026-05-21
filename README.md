# Recipe Recommender Web Application

A full-stack web application that recommends recipes based on ingredients selected by the user.

## Tech Stack

- **Frontend:** React (Create React App)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **API:** External Recipe REST API

## Features

- Ingredient-based recipe recommendations via external REST API
- Save and manage favourite recipes
- User preference storage with MongoDB
- RESTful CRUD operations with MVC-style backend architecture

## Project Structure
Recipe_Recommender/
├── client/       # React frontend
└── backend/      # Node.js + Express server

## Getting Started

### Prerequisites
- Node.js
- MongoDB

### Installation

```bash
# Clone the repository
git clone https://github.com/BhukyaSrividhya/Recipe_Recommender.git

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Running the App

```bash
# Start backend
cd backend
npm start

# Start frontend (in a new terminal)
cd client
npm start
```

Frontend runs on `http://localhost:3000`
