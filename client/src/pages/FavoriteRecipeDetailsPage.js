import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./RecipeDetailsPage.css";

function FavoriteRecipeDetailsPage() {
  const { id } = useParams(); // This is the MongoDB _id of the favorite
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    loadFavorite();
  }, []);

  const loadFavorite = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/favorites/item/${id}`
      );
      setRecipe(res.data);
    } catch (err) {
      console.log("Favorite fetch error:", err);
    }
  };

  const removeFavorite = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/favorites/remove/${id}`);
      navigate("/favorites");
    } catch (err) {
      console.log("Remove favorite error:", err);
    }
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

        {recipe.summary && (
          <p
            className="recipe-summary"
            dangerouslySetInnerHTML={{ __html: recipe.summary }}
          />
        )}

        <button className="fav-btn" onClick={removeFavorite}>
          ★ Remove from Favorites
        </button>
      </div>

      <div className="recipe-bottom">
        <div className="ingredients-box">
          <h2>Ingredients</h2>
          <ul>
            {recipe.ingredients?.map((ing, index) => (
              <li key={index}>{ing}</li>
            ))}
          </ul>
        </div>

        <div className="instructions-box">
          <h2>Instructions</h2>
          <ol>
            {recipe.instructions?.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default FavoriteRecipeDetailsPage;
