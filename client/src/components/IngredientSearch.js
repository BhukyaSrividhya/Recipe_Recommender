import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const IngredientSearch = ({ isLoggedIn }) => {
  const [ingredients, setIngredients] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const navigate = useNavigate();

  // Refs for scrolling behavior
  const suggestionsContainerRef = useRef(null);
  const itemRefs = useRef([]);

  // Reset item refs whenever suggestions change
  useEffect(() => {
    itemRefs.current = [];
    setHighlightIndex(-1);
  }, [suggestions]);

  // Fetch suggestions (debounced)
  useEffect(() => {
    if (currentInput.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => fetchSuggestions(currentInput), 300);
    return () => clearTimeout(timer);
  }, [currentInput]);

  const fetchSuggestions = async (query) => {
    try {
      const response = await axios.get(
        "https://api.spoonacular.com/food/ingredients/autocomplete",
        {
          params: {
            apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY,
            query,
            number: 10,
          },
        }
      );
      setSuggestions(response.data || []);
    } catch (err) {
      console.error("Suggestion error:", err);
    }
  };

  // ⭐ FIXED SCROLLING + HIGHLIGHT BEHAVIOR
  useEffect(() => {
    if (
      highlightIndex >= 0 &&
      itemRefs.current[highlightIndex] &&
      suggestionsContainerRef.current
    ) {
      const container = suggestionsContainerRef.current;
      const item = itemRefs.current[highlightIndex];

      const containerTop = container.scrollTop;
      const containerBottom = containerTop + container.clientHeight;

      const itemTop = item.offsetTop;
      const itemBottom = itemTop + item.offsetHeight;

      // Scroll DOWN only when needed
      if (itemBottom > containerBottom) {
        container.scrollTop = itemBottom - container.clientHeight;
      }
      // Scroll UP only when needed
      else if (itemTop < containerTop) {
        container.scrollTop = itemTop;
      }
    }
  }, [highlightIndex]);

  // Add ingredient
  const addIngredient = (name) => {
    const formatted = name.toLowerCase().trim();
    if (formatted && !ingredients.includes(formatted)) {
      setIngredients((prev) => [...prev, formatted]);
    }
    setCurrentInput("");
    setSuggestions([]);
    setHighlightIndex(-1);
  };

  // Remove ingredient
  const removeIngredient = (index) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  // SEARCH RECIPES
  const searchForRecipes = async (ingredientList) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (!ingredientList.length) return;

    try {
      const response = await axios.get(
        "https://api.spoonacular.com/recipes/findByIngredients",
        {
          params: {
            ingredients: ingredientList.join(","),
            number: 30,
            apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY,
          },
        }
      );

      navigate("/results", {
        state: {
          recipes: response.data,
          recipesFromSearch: response.data,
          visibleCount: 10,
        },
      });
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  // KEYBOARD HANDLERS
  const handleKeyDown = (e) => {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    setHighlightIndex((prev) =>
      prev < suggestions.length - 1 ? prev + 1 : prev
    );
    return;
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    setHighlightIndex((prev) => (prev > 0 ? prev - 1 : -1));
    return;
  }

  if (e.key === "Enter") {
    e.preventDefault();

    // CASE 1: Dropdown open → select item, DO NOT SEARCH
    if (suggestions.length > 0) {
      if (highlightIndex >= 0) {
        addIngredient(suggestions[highlightIndex].name);
      } else {
        addIngredient(suggestions[0].name); // first item
      }
      return;
    }

    // CASE 2: Dropdown closed + ingredients exist → SEARCH
    if (ingredients.length > 0) {
      searchForRecipes(ingredients);
      return;
    }

    // CASE 3: No suggestions + no ingredients → do nothing
    return;
  }
};

  return (
    <div className="ingredient-search-container">
      <label>To begin, enter the ingredients you have nearby.</label>

      <div className="ingredient-input-wrapper">
        <div className="ingredient-input-box">
          <div className="tags-input-wrapper">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-tag">
                {ingredient}
                <button
                  type="button"
                  className="remove-tag-button"
                  onClick={() => removeIngredient(index)}
                >
                  ×
                </button>
              </div>
            ))}

            <input
              type="text"
              className="ingredient-input-field"
              value={currentInput}
              onChange={(e) => {
                setCurrentInput(e.target.value);
                setHighlightIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Add an ingredient..."
              autoComplete="off"
            />
          </div>

          <div className="search-separator"></div>

          {/* SEARCH BUTTON (the ONLY way to search) */}
          <button
            type="button"
            className="ingredient-search-button"
            onClick={() => {
              let final = [...ingredients];

              if (currentInput.trim()) {
                final.push(currentInput.trim().toLowerCase());
              }

              setCurrentInput("");
              setSuggestions([]);
              setHighlightIndex(-1);

              if (final.length > 0) {
                searchForRecipes(final);
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </button>
        </div>

        {suggestions.length > 0 && (
          <ul
            className="suggestions-list"
            ref={suggestionsContainerRef}
            style={{
              maxHeight: 200,
              overflowY: "auto",
              border: "1px solid #ddd",
              borderRadius: 6,
              marginTop: 8,
              padding: 0,
              listStyle: "none",
            }}
          >
            {suggestions.map((s, index) => (
              <li
                key={s.id}
                ref={(el) => (itemRefs.current[index] = el)}
                onClick={() => addIngredient(s.name)}
                onMouseEnter={() => setHighlightIndex(index)}
                onMouseLeave={() => setHighlightIndex(-1)}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  background:
                    index === highlightIndex ? "#e6f1ff" : "transparent",
                }}
              >
                {s.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default IngredientSearch;
