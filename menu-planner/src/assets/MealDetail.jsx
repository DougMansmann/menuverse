// src/pages/MealDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './MealDetail.css';        
import { apiFetch } from "../utils/api.js"; // New import

const MealDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        const data = await response.json();
        setMeal(data.meals?.[0] || null);
      } catch (err) {
        setError('Failed to load meal details');
      } finally {
        setLoading(false);
      }
    };
    fetchMeal();
  }, [id]);

  const handleAddToMyTable = async () => {
    if (!meal) return;

    const isSide = meal.strCategory?.toLowerCase() === 'side';
    const endpoint = isSide
      ? 'http://localhost:8080/api/sides'
      : 'http://localhost:8080/api/maincourse';

    const payload = {
      name: meal.strMeal,
      category: meal.strCategory, 
      orgin: meal.strArea,
      daysBetween: 28,
      numsides: 0,
      // lastTime: new Date().toISOString().split('T')[0],  <-- this was current date
      lastTime: "2025-01-01",  // hardcoded to be in the past
      menuapi_id: Number(meal.idMeal),
    };

    try {
      const response = await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setAdded(true);
        setTimeout(() => setAdded(false), 3000);
      } else {
        const text = await response.text();
        alert(`Failed to add meal: ${response.status} ${text}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error adding meal');
    }
  };

  if (loading) return <div className="loading">Loading meal details...</div>;
  if (error) return <p className="error">{error}</p>;
  if (!meal) return <p className="error">Meal not found</p>;

  return (
    <div className="meal-detail-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        Back to Results
      </button>

      <div className="meal-detail">
        <img src={meal.strMealThumb} alt={meal.strMeal} className="detail-img" />

        <div className="meal-info">
          <h1>{meal.strMeal}</h1>
          <p>
            <strong>Category:</strong> {meal.strCategory} | <strong>Origin:</strong> {meal.strArea}
          </p>

          <button
            onClick={handleAddToMyTable}
            className={`add-btn ${added ? 'added' : ''}`}
            disabled={added}
          >
            {added ? 'Added!' : 'Add to My Meals'}
          </button>

          <h2>Instructions</h2>
          <p className="instructions">{meal.strInstructions}</p>

          {meal.strSource && (
            <p>
              <a href={meal.strSource} target="_blank" rel="noopener noreferrer">
                View Original Recipe
              </a>
            </p>
          )}

          {meal.strYoutube && (
            <p>
              <a href={meal.strYoutube} target="_blank" rel="noopener noreferrer">
                Watch on YouTube
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealDetail;