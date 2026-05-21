// src/pages/HomePage.js
import React from 'react';
import Hero from '../components/Hero';

function HomePage({ isLoggedIn }) {
  return (
    <main>
      <Hero isLoggedIn={isLoggedIn}/>
    </main>
  );
}

export default HomePage;


