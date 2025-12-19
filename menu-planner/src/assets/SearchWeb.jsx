// src/pages/SearchWeb.jsx   (or wherever you keep it)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchWeb.css';

const SearchWeb = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Load categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          'https://www.themealdb.com/api/json/v1/1/list.php?c=list'
        );
        const data = await response.json();

        if (data.meals) {
          const sorted = data.meals.sort((a, b) =>
            a.strCategory.localeCompare(b.strCategory)
          );
          setCategories(sorted);
        }
      } catch (err) {
        setError('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  // Search meals by selected category
  const handleSearch = async () => {
    if (!selectedCategory) {
      alert('Please select a category');
      return;
    }

    setLoading(true);
    setError(null);
    setMeals([]);

    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`
      );
      const data = await response.json();

      setMeals(data.meals || []);
      if (!data.meals) setError('No meals found for this category');
    } catch (err) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const goToDetail = (mealId) => {
    navigate(`/meal/${mealId}`);
  };

  return (
    <div className="search-web-container">
      <h1>Meal Finder by Category</h1>

      <div className="search-bar">
        {/* You can rename the class to "category-select" if you prefer */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="ingredient-select"
        >
          <option value="">-- Select a category --</option>
          {categories.map((cat) => (
            <option key={cat.strCategory} value={cat.strCategory}>
              {cat.strCategory}
            </option>
          ))}
        </select>

        <button
          onClick={handleSearch}
          disabled={loading || !selectedCategory}
        >
          {loading ? 'Searching...' : 'Search Meals'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="meals-grid">
        {meals.length > 0 ? (
          meals.map((meal) => (
            <div
              key={meal.idMeal}
              className="meal-card"
              onClick={() => goToDetail(meal.idMeal)}
              style={{ cursor: 'pointer' }}
            >
              <img src={meal.strMealThumb} alt={meal.strMeal} />
              <h3>{meal.strMeal}</h3>
            </div>
          ))
        ) : (
          selectedCategory && !loading && <p className="no-results">No meals found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchWeb;