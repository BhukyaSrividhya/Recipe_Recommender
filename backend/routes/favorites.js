const express = require("express");
const router = express.Router();
const Favorite = require("../models/Favorite");

// ➤ ADD FAVORITE
router.post("/add", async (req, res) => {
  try {
    const { userId, recipe } = req.body;

    if (!userId || !recipe) {
      return res.status(400).json({ success: false, message: "Missing data" });
    }

    const exists = await Favorite.findOne({
      userId,
      spoonacularId: recipe.id,
    });

    if (exists) {
      return res.json({ success: true, message: "Already in favorites" });
    }

    const newFav = new Favorite({
      userId,
      spoonacularId: recipe.id,

      // store full details
      title: recipe.title,
      image: recipe.image,
      summary: recipe.summary,
      healthScore: recipe.healthScore,
      readyInMinutes: recipe.readyInMinutes,
      servings: recipe.servings,

      // map list of ingredients into simple text
      ingredients: recipe.extendedIngredients.map(i => i.original),

      // map instructions into plain text
      instructions: recipe.analyzedInstructions[0]?.steps.map(s => s.step) || []
    });

    await newFav.save();
    res.json({ success: true, message: "Added to favorites", favorite: newFav });

  } catch (err) {
    console.error("Add favorite error:", err);
    res.status(500).json({ success: false });
  }
});



// ➤ REMOVE FAVORITE
router.delete("/remove", async (req, res) => {
  try {
    const { userId, recipeId } = req.body;

    await Favorite.findOneAndDelete({
      userId,
      spoonacularId: recipeId,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Remove favorite error:", err);
    res.status(500).json({ success: false });
  }
});

// ➤ CHECK FAVORITE
router.get("/check/:userId/:recipeId", async (req, res) => {
  try {
    const fav = await Favorite.findOne({
      userId: req.params.userId,
      spoonacularId: req.params.recipeId,
    });

    res.json({ isFavorite: !!fav });
  } catch (err) {
    console.error("Check favorite error:", err);
    res.status(500).json({ isFavorite: false });
  }
});

// ➤ GET ALL FAVORITES
router.get("/:userId", async (req, res) => {
  try {
    const favs = await Favorite.find({ userId: req.params.userId });
    res.json(favs);
  } catch (err) {
    console.error("Fetch favorites error:", err);
    res.status(500).json([]);
  }
});

module.exports = router;

router.get("/item/:id", async (req, res) => {
  try {
    const fav = await Favorite.findById(req.params.id);
    res.json(fav);
  } catch (err) {
    console.error(err);
    res.status(500).json({});
  }
});

// Get single favorite item
router.get("/item/:id", async (req, res) => {
  try {
    const fav = await Favorite.findById(req.params.id);
    res.json(fav);
  } catch (err) {
    console.error(err);
    res.status(500).json(null);
  }
});

// Remove favorite by MongoDB _id
router.delete("/remove/:id", async (req, res) => {
  try {
    await Favorite.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

