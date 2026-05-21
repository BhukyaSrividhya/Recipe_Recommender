import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./RecipeDetailsPage.css";

function RecipeDetailsPage({ isLoggedIn }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchRecipe();
    checkFavoriteStatus();
  }, []);

  // ------------------------------------
  // Fetch Full Recipe Data
  // ------------------------------------
  const fetchRecipe = async () => {
    try {
      const res = await axios.get(
        `https://api.spoonacular.com/recipes/${id}/information`,
        {
          params: { apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY },
        }
      );
      setRecipe(res.data);
    } catch (error) {
      console.log("Recipe fetch error:", error);
    }
  };

  // ------------------------------------
  // CHECK if in favorites
  // ------------------------------------
  const checkFavoriteStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (!token || !userId) return;

      const res = await axios.get(
        `http://localhost:5000/api/favorites/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const found = res.data.some((fav) => fav.spoonacularId == id);
      setIsFavorite(found);
    } catch (err) {
      console.log("Favorite check error:", err);
    }
  };

  // ------------------------------------
  // ADD favorite
  // ------------------------------------
  const addFavorite = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      await axios.post(
        "http://localhost:5000/api/favorites/add",
        {
          userId,
          recipe: recipe, //🔥 send full recipe object
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setIsFavorite(true);
    } catch (err) {
      console.log("Add favorite error:", err);
    }
  };

  // ------------------------------------
  // REMOVE favorite
  // ------------------------------------
  const removeFavorite = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      await axios.delete("http://localhost:5000/api/favorites/remove", {
        data: {
          userId,
          recipeId: recipe.id,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      setIsFavorite(false);
    } catch (err) {
      console.log("Remove favorite error:", err);
    }
  };

  // ------------------------------------
  // Toggle Favorite
  // ------------------------------------
  const toggleFavorite = () => {
    if (!localStorage.getItem("token")) return navigate("/login");

    if (isFavorite) removeFavorite();
    else addFavorite();
  };

  if (!recipe) return <div>Loading...</div>;

  return (
    <div className="recipe-page">
      <div className="recipe-hero">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <img
          src={recipe.image}
          alt={recipe.title}
          onError={(e) => {
            e.currentTarget.onerror = null; // prevents infinite loop
            e.currentTarget.src =
              "https://cdn-icons-png.flaticon.com/512/1046/1046857.png"; // your fallback image
          }}
        />
      </div>

      <div className="recipe-info-card">
        <h1>{recipe.title}</h1>
        <p dangerouslySetInnerHTML={{ __html: recipe.summary }} />

        <div className="recipe-metrics">
          <span>⏱ {recipe.readyInMinutes} min</span>
          <span>🍽 {recipe.servings} servings</span>
          <span>⭐ {recipe.healthScore} health score</span>
        </div>

        <button className="fav-btn" onClick={toggleFavorite}>
          {isFavorite ? "★ Remove from Favorites" : "☆ Add to Favorites"}
        </button>
      </div>

      <div className="recipe-bottom">
        <div className="ingredients-box">
          <h2>Ingredients</h2>
          <ul>
            {recipe.extendedIngredients.map((ing) => (
              <li key={ing.id}>{ing.original}</li>
            ))}
          </ul>
        </div>

        <div className="instructions-box">
          <h2>Instructions</h2>
          <ol>
            {recipe.analyzedInstructions[0]?.steps.map((step) => (
              <li key={step.number}>{step.step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetailsPage;
