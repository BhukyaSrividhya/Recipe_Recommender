const mongoose = require("mongoose");

const MyRecipeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String },
  ingredients: { type: [String], required: true },
  instructions: { type: [String], required: true },
}, { timestamps: true });

module.exports = mongoose.model("MyRecipe", MyRecipeSchema);
