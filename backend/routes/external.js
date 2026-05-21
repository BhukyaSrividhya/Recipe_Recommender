const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/search", async (req, res) => {
  try {
    const ingredients = req.query.ingredients;

    const response = await axios.get(
      `https://api.spoonacular.com/recipes/findByIngredients`,
      {
        params: {
          ingredients,
          number: 10,
          apiKey: process.env.SPOONACULAR_API_KEY
        }
      }
    );

    res.json({ success: true, results: response.data });

  } catch (err) {
    console.error("Spoonacular Error:", err.message);
    res.status(500).json({ success: false, message: "API error" });
  }
});

module.exports = router;
