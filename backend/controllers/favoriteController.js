const Favorite = require("../models/Favorite");

// GET all favorites of logged-in user
exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user.id });
    res.json(favorites);
  } catch (e) {
    res.status(500).json({ message: "Cannot fetch favorites" });
  }
};

// ADD favorite
exports.addFavorite = async (req, res) => {
  try {
    const { recipeId, title, image, readyInMinutes, servings, healthScore } = req.body;

    const exists = await Favorite.findOne({ userId: req.user.id, recipeId });
    if (exists) return res.json({ message: "Already in favorites" });

    const fav = new Favorite({
      userId: req.user.id,
      recipeId,
      title,
      image,
      readyInMinutes,
      servings,
      healthScore
    });

    await fav.save();
    res.json({ success: true, favorite: fav });
  } catch (e) {
    res.status(500).json({ message: "Cannot add favorite" });
  }
};

// REMOVE favorite
exports.removeFavorite = async (req, res) => {
  try {
    await Favorite.findOneAndDelete({
      userId: req.user.id,
      recipeId: req.params.recipeId
    });

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ message: "Cannot remove favorite" });
  }
};
