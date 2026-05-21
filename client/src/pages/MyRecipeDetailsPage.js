import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./RecipeDetailsPage.css"; // reuse styling

export default function MyRecipeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    title: "",
    image: "",
    ingredients: [],
    instructions: [],
  });

  useEffect(() => {
    loadRecipe();
  }, []);

  const loadRecipe = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/myrecipes/single/${id}`
    );
    setRecipe(res.data);

    setForm({
      title: res.data.title,
      image: res.data.image,
      ingredients: res.data.ingredients,
      instructions: res.data.instructions,
    });
  };

  const handleUpdate = async () => {
    await axios.put(`http://localhost:5000/api/myrecipes/update/${id}`, form);
    setIsEditing(false);
    loadRecipe();
  };

  const handleDelete = async () => {
    await axios.delete(`http://localhost:5000/api/myrecipes/${id}`);
    navigate("/my-recipes"); // redirects correctly
  };

  if (!recipe) return <div>Loading...</div>;

  return (
    <div className="recipe-page">
      {/* HERO IMAGE */}
      <div className="recipe-hero">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <img src={recipe.image} alt={recipe.title} />
      </div>

      {/* MIDDLE CARD */}
      <div className="recipe-info-card">

        {/* EDIT MODE */}
        {isEditing ? (
          <>
            <h2>Edit Your Recipe</h2>

            <input
              className="edit-input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Recipe Title"
            />

            <input
              className="edit-input"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="Image URL"
            />

            <textarea
              className="edit-input"
              rows="5"
              value={form.ingredients.join("\n")}
              onChange={(e) =>
                setForm({ ...form, ingredients: e.target.value.split("\n") })
              }
              placeholder="Ingredients (one per line)"
            />

            <textarea
              className="edit-input"
              rows="5"
              value={form.instructions.join("\n")}
              onChange={(e) =>
                setForm({ ...form, instructions: e.target.value.split("\n") })
              }
              placeholder="Instructions (one step per line)"
            />

            <button className="fav-btn" onClick={handleUpdate}>
              ✔ Save Changes
            </button>

            <button
              className="fav-btn remove"
              onClick={() => setIsEditing(false)}
            >
              ✖ Cancel
            </button>
          </>
        ) : (
          <>
            {/* TITLE */}
            <h1>{recipe.title}</h1>

            {/* BUTTONS WRAPPED FOR SPACING */}
            <div className="recipe-actions">
              <button className="fav-btn" onClick={() => setIsEditing(true)}>
                ✎ Modify Recipe
              </button>

              <button className="fav-btn remove" onClick={handleDelete}>
                🗑 Remove from My Recipes
              </button>
            </div>
          </>
        )}
      </div>

      {/* SHOW CONTENT ONLY WHEN NOT EDITING */}
      {!isEditing && (
        <div className="recipe-bottom">
          <div className="ingredients-box">
            <h2>Ingredients</h2>
            <ul>
              {recipe.ingredients.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
          </div>

          <div className="instructions-box">
            <h2>Instructions</h2>
            <ol>
              {recipe.instructions.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

