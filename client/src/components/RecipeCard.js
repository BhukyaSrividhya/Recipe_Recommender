import React from "react";
import { useNavigate } from "react-router-dom";

function RecipeCard({ recipe, isMyRecipe = false, isFavorite = false }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isMyRecipe) {
      // User-created recipe → MongoDB id
      navigate(`/myrecipe/${recipe.id}`);
    } else if (isFavorite) {
      // Favorite recipe → MongoDB _id
      navigate(`/favorite/${recipe._id}`);
    } else {
      // Spoonacular recipe → API id
      navigate(`/recipe/${recipe.id}`);
    }
  };

  return (
    <div className="result-card" onClick={handleClick}>
      <img
        src={recipe.image}
        alt={recipe.title}
        onError={(e) => {
          e.currentTarget.onerror = null; // prevents infinite loop
          e.currentTarget.src =
            "https://cdn-icons-png.flaticon.com/512/1046/1046857.png"; // your fallback image
        }}
      />
      <h3>{recipe.title}</h3>
    </div>
  );
}

export default RecipeCard;
