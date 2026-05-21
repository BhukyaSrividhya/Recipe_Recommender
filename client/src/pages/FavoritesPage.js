import React, { useEffect, useState } from "react";
import axios from "axios";
import RecipeCard from "../components/RecipeCard";

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadFavs = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId"); // ← GET USER ID

        if (!userId) {
          console.log("No user ID found");
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/api/favorites/${userId}`, // ← FIXED URL
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setFavorites(res.data);
      } catch (err) {
        console.log("Favorites load error:", err);
      }
    };

    loadFavs();
  }, []);

  return (
    <div className="recipe-list-container">
      <h2>My Favorites</h2>

      {favorites.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        <div className="recipe-grid">
          {favorites.map((fav) => (
            <RecipeCard key={fav._id} isFavorite={true} recipe={fav} />
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;
