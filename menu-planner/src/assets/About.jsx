// src/pages/About.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css'; // optional – create this file for styling

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="about-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        Back
      </button>

      <div className="about-content">
        <h1>About Menuverse</h1>

        <section className="about-section">
          <h2>What is this app?</h2>
          <p>
            This is a simple <strong>personal meal planner</strong> that helps you
            discover new recipes and keep track of your favorite meals — both main courses and sides.
          </p>
          <p>
            You browse thousands of real recipes from around the world, and with one click you can add
            them to your own rotating meal plan.
          </p>
        </section>

        <section className="about-section">
          <h2>How it works</h2>
          <ul>
            <li>Browse meals by category (Beef, Chicken, Dessert, Side, etc.)</li>
            <li>Click any meal to see full details and instructions</li>
            <li>Hit "Add to My Meals" to save it to your personal list</li>
            <li>Sides go to your sides list, everything else goes to main courses</li>
            <li>Your backend tracks how often you eat each meal and helps avoid repetition</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Tech Stack</h2>
          <div className="tech-grid">
            <div className="tech-item">
              <strong>Frontend:</strong> React + Vite + React Router
            </div>
            <div className="tech-item">
              <strong>Backend:</strong> Spring Boot + MySQL
            </div>
            <div className="tech-item">
              <strong>Recipe Data:</strong> TheMealDB.com (free public API)
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Why I built this</h2>
          <p>
            I wanted to DEMO my Full Stack programming skills.  I also wanted to see if I could create an app that would answer: "What should we eat this week?"<br />
            Now the app remembers what I like, shows me new ideas, and makes meal planning fun again.
          </p>
        </section>

        <footer className="about-footer">
          <p>Enjoy your meals!</p>
        </footer>
      </div>
    </div>
  );
};

export default About;