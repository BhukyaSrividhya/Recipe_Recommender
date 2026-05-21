
const express = require("express");
const router = express.Router();
const MyRecipe = require("../models/MyRecipe");

// ✅ Get all recipes for a user
router.get("/:userId", async (req, res) => {
  try {
    const recipes = await MyRecipe.find({ userId: req.params.userId });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching recipes" });
  }
});

// ✅ Get a single recipe
// GET single recipe
router.get("/single/:id", async (req, res) => {
  try {
    const recipe = await MyRecipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    res.json(recipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Add a recipe
router.post("/add", async (req, res) => {
  try {
    const { userId, title, image, ingredients, instructions } = req.body;

    const newRecipe = new MyRecipe({
      userId,
      title,
      image,
      ingredients,
      instructions,
    });

    await newRecipe.save();
    res.json({ success: true, recipe: newRecipe });
  } catch (err) {
    res.status(500).json({ message: "Could not add recipe" });
  }
});

// ✅ Update a recipe
router.put("/update/:id", async (req, res) => {
  try {
    const { title, image, ingredients, instructions } = req.body;

    const updated = await MyRecipe.findByIdAndUpdate(
      req.params.id,
      { title, image, ingredients, instructions },
      { new: true }
    );

    res.json({ success: true, recipe: updated });
  } catch (err) {
    res.status(500).json({ message: "Could not update recipe" });
  }
});

// ✅ Delete a recipe
router.delete("/:id", async (req, res) => {
  try {
    await MyRecipe.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Could not delete recipe" });
  }
});

module.exports = router;
