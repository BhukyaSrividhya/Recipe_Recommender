// client/src/components/Hero.js
import React from 'react';
import IngredientSearch from './IngredientSearch';

// --- 1. Accept isLoggedIn here ---
function Hero({ isLoggedIn }) {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1>Discover Your Next Favorite Recipe</h1>
        <p>Explore delicious recipes from around the world</p>
        
        {/* --- 2. Pass it to IngredientSearch --- */}
        <IngredientSearch isLoggedIn={isLoggedIn} />
        
      </div>
    </div>
  );
}

export default Hero;