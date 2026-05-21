/*import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RecipeCard from "../components/RecipeCard";
import "./MyRecipesPage.css";

function MyRecipesPage() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [myRecipes, setMyRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);

  const placeholder = "https://dummyimage.com/300x200/cccccc/000000&text=My+Recipe";

  // 🔥 FETCH from DB
  const loadMyRecipes = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/myrecipes/${userId}`
      );
      setMyRecipes(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMyRecipes();
  }, []);

  // 🔥 ADD RECIPE to DB
  const handleSubmit = async (e) => {
    e.preventDefault();

    const recipeData = {
      userId,
      title,
      image: imageUrl || placeholder,
      ingredients: ingredients.split(","),
      instructions: instructions.split(". ").filter((x) => x.trim() !== ""),
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/myrecipes/add",
        recipeData
      );

      setMyRecipes([res.data.recipe, ...myRecipes]);
      setIsFormVisible(false);

      // Clear fields
      setTitle("");
      setImageUrl("");
      setIngredients("");
      setInstructions("");
    } catch (err) {
      console.error("Add recipe error:", err);
    }
  };

  return (
    <div className="my-recipes-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="my-recipes-header">
        <h2>My Recipes</h2>
        <button className="form-button" onClick={() => setIsFormVisible(true)}>
          ➕ Add Recipe
        </button>
      </div>

      {isFormVisible && (
        <div className="recipe-form-container">
          <h2>Add Your Recipe</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-input-group">
              <label>Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-input-group">
              <label>Image URL</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            <div className="form-input-group">
              <label>Ingredients (comma separated) *</label>
              <textarea
                required
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
              />
            </div>

            <div className="form-input-group">
              <label>Instructions (separate with periods) *</label>
              <textarea
                required
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </div>

            <div className="form-button-group">
              <button type="submit" className="form-button">
                Add
              </button>
              <button
                type="button"
                className="form-button-outline"
                onClick={() => setIsFormVisible(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : myRecipes.length === 0 ? (
        <p className="empty-recipes-message">You have no recipes yet.</p>
      ) : (
        <div className="recipe-grid">
          {myRecipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              isMyRecipe={true}
              recipe={{
                id: recipe._id, // DB id
                title: recipe.title,
                image: recipe.image,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRecipesPage;    */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import RecipeManager from "../utils/RecipeManager";
import UIEvents from "../utils/UIEvents";
import "./MyRecipesPage.css";

const recipeManager = new RecipeManager("http://localhost:5000/api/myrecipes");

function MyRecipesPage() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [myRecipes, setMyRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);

  const placeholder = "https://dummyimage.com/300x200/cccccc/000000&text=My+Recipe";

  // 🔥 FETCH (using RecipeManager class)
  const loadMyRecipes = async () => {
    setLoading(true);
    const data = await recipeManager.getAll(userId);
    setMyRecipes(data);
    setLoading(false);
  };

  useEffect(() => {
    loadMyRecipes();

    // Listen for custom event (Recipe Deleted)
    UIEvents.listen("recipeDeleted", () => {
      loadMyRecipes();
    });
  }, []);

  // 🔥 ADD (using class + callback + custom event)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const recipeData = {
      userId,
      title,
      image: imageUrl || placeholder,
      ingredients: ingredients.split(","),
      instructions: instructions.split(". ").filter((x) => x.trim() !== ""),
    };

    const res = await recipeManager.addRecipe(recipeData);

    // Callback to update UI state
    setMyRecipes([res.recipe, ...myRecipes]);

    // Emit event for analytics/custom listeners
    UIEvents.emit("recipeAdded", { title: recipeData.title });

    setIsFormVisible(false);

    setTitle("");
    setImageUrl("");
    setIngredients("");
    setInstructions("");
  };

  return (
    <div className="my-recipes-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="my-recipes-header">
        <h2>My Recipes</h2>
        <button className="form-button" onClick={() => setIsFormVisible(true)}>
          ➕ Add Recipe
        </button>
      </div>

      {isFormVisible && (
        <div className="recipe-form-container">
          <h2>Add Your Recipe</h2>

          <form onSubmit={handleSubmit}>

            <div className="form-input-group">
              <label>Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-input-group">
              <label>Image URL</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            <div className="form-input-group">
              <label>Ingredients (comma separated) *</label>
              <textarea
                required
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
              />
            </div>

            <div className="form-input-group">
              <label>Instructions (separate with periods) *</label>
              <textarea
                required
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </div>

            <div className="form-button-group">
              <button type="submit" className="form-button">
                Add
              </button>
              <button
                type="button"
                className="form-button-outline"
                onClick={() => setIsFormVisible(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : myRecipes.length === 0 ? (
        <p className="empty-recipes-message">You have no recipes yet.</p>
      ) : (
        <div className="recipe-grid">
          {myRecipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              isMyRecipe={true}
              recipe={{
                id: recipe._id,
                title: recipe.title,
                image: recipe.image,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRecipesPage;

