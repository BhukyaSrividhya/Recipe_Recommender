import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import RecipeDetailsPage from "./pages/RecipeDetailsPage";
import FavoritesPage from "./pages/FavoritesPage";
import MyRecipesPage from "./pages/MyRecipesPage";
import MyRecipeDetailsPage from "./pages/MyRecipeDetailsPage";
import FavoriteRecipeDetailsPage from "./pages/FavoriteRecipeDetailsPage";

function ProtectedRoute({ isLoggedIn, children }) {
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // 🔍 Check auth on refresh BEFORE rendering routes
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");

    if (token && userId && username) {
      setIsLoggedIn(true);
    } else {
      localStorage.clear();
      setIsLoggedIn(false);
    }

    setAuthChecked(true);
  }, []);

  if (!authChecked) return null;

  const handleLogin = () => setIsLoggedIn(true);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <Routes>
        {/* Home */}
        <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} />} />

        {/* Login */}
        <Route
          path="/login"
          element={<LoginPage onLoginSuccess={handleLogin} />}
        />

        {/* Search Results */}
        <Route
          path="/results"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <SearchResultsPage />
            </ProtectedRoute>
          }
        />

        {/* Spoonacular Recipe */}
        <Route
          path="/recipe/:id"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <RecipeDetailsPage />
            </ProtectedRoute>
          }
        />

        {/* Favorites */}
        <Route
          path="/favorites"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />

        {/* My Recipes */}
        <Route
          path="/my-recipes"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <MyRecipesPage />
            </ProtectedRoute>
          }
        />

        {/* My Recipe Details */}
        <Route
          path="/myrecipe/:id"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <MyRecipeDetailsPage />
            </ProtectedRoute>
          }
        />

        {/* Favorite Recipe Details */}
        <Route
          path="/favorite/:id"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <FavoriteRecipeDetailsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
