const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  spoonacularId: { type: Number, required: true },

  // 🔥 Store full recipe details
  title: String,
  image: String,
  summary: String,
  healthScore: Number,
  readyInMinutes: Number,
  servings: Number,

  ingredients: [String],
  instructions: [String],
});

module.exports = mongoose.model("Favorite", FavoriteSchema);
