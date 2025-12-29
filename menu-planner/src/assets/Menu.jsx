// Menu.jsx
import React, { useState, useRef, useEffect } from 'react';
import './Menu.css';
import { apiFetch } from "../utils/api.js"; 

const Menu = () => {
  const [days, setDays] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [currentlyReplacing, setCurrentlyReplacing] = useState(null); // this is for replacing the menu choice

  // This is the magic line – always holds the latest menu
  const menuRef = useRef([]);
  
  // Keep the ref in sync with the state (never causes re-render)
  useEffect(() => {
    menuRef.current = menu;
  }, [menu]);

  useEffect(() => {
  // After menu is set, fetch sides for any day that needs them
  menu.forEach((item, index) => {
    if (item.course?.numsides > 0 && !item.sides?.length && !item.loadingSides) {
      fetchSidesForDay(index);
    }
  });
  }, [menu]);

  
  const fetchSidesForDay = async (dayIndex) => {
    const mainCourse = menuRef.current[dayIndex]?.course;
    if (!mainCourse || mainCourse.numsides <= 0) return;

    // Update UI to show sides loading
    setMenu(prev => {
      const updated = [...prev];
      updated[dayIndex] = { ...updated[dayIndex], loadingSides: true };
      return updated;
    });

    try {
      // Get all side IDs of sides already used across the menu
      const usedSideIds = menuRef.current
        .flatMap(item => item.sides || [])
        .map(side => side.id);

      const params = new URLSearchParams();
      usedSideIds.forEach(id => params.append('excludeIds', id));
      params.append('limit', mainCourse.numsides);

      const res = await apiFetch(`http://localhost:8080/api/sides/random?${params}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Not enough side dishes available!" + `: ${res.status}`);
        }
        throw new Error("Failed to load sides" + `: ${res.status}`);
      }

      const newSides = await res.json(); // expects array

      setMenu(prev => {
        const updated = [...prev];
        updated[dayIndex] = {
          ...updated[dayIndex],
          sides: newSides,
          loadingSides: false,
        };
        return updated;
      });
    } catch (err) {
      console.error("Failed to fetch sides:", err);
      alert(err.message || "Couldn't load side dishes.");

      setMenu(prev => {
        const updated = [...prev];
        updated[dayIndex] = { ...updated[dayIndex], loadingSides: false };
        return updated;
      });
    }
  };

  // Fetch initial menu for selected number of days
  const fetchMenu = async (numDays) => {
    setLoadingInitial(true);
    try {
      const res = await apiFetch(`http://localhost:8080/api/menu?days=${numDays}`);
      const data = await res.json();

      const initialMenu = Array.from({ length: numDays }, (_, i) => ({
        day: i + 1,
        course: data[i] || null,
        sides: [],  
        loading: false,
        loadingSides: false,
      }));

      setMenu(initialMenu);
      setDays(numDays);

    } catch (err) {
      console.error('Failed to fetch menu', err);
      alert('Failed to load menu. Please try again.');
    } finally {
      setLoadingInitial(false);
    }
  };

  // Reject current item and get a new random one for that day
  const rejectAndReplace = async (dayIndex) => {
    if (currentlyReplacing !== null) return;
    setCurrentlyReplacing(dayIndex);

    // Show loading
    setMenu(prev => {
      const updated = [...prev];
      updated[dayIndex] = { ...updated[dayIndex], loading: true };
      return updated;
    });

    try {
      const usedCourseIds = menuRef.current
        .filter((item, idx) => idx !== dayIndex && item.course)
        .map(item => item.course.id);

      // THIS IS THE KEY LINE
      if (usedCourseIds.length === 0) {
        usedCourseIds.push(-1); // dummy ID that never exists
      }

      const params = new URLSearchParams();
      usedCourseIds.forEach(id => params.append('excludeIds', id));

      const res = await apiFetch(`http://localhost:8080/api/menu/random?${params}`);
      if (!res.ok) {
        const text = await res.text();
        if (res.status === 404) {
          throw new Error("No available main courses right now. Add some courses or wait a few days!");
        }
        throw new Error(`Server error: ${res.status} ${text || 'No response'}`);
      }

      const newCourse = await res.json();

      setMenu(prev => {
        const updated = [...prev];
        updated[dayIndex] = {
          ...updated[dayIndex],
          course: newCourse,
          sides: [], // reset sides
          loading: false,
          loadingSides: false,  
        };
        return updated;
      });

    // Fetch sides if needed
    if (newCourse.numsides > 0) {
      fetchSidesForDay(dayIndex);
    }
  } catch (err) {
    console.error('Replace failed:', err.message);

    // Friendly message instead of scary alert
    alert(err.message || 'Could not get a new suggestion.');

    // Always clear loading
    setMenu(prev => {
      const updated = [...prev];
      updated[dayIndex] = { ...updated[dayIndex], loading: false };
      return updated;
    });
  } finally {
    setCurrentlyReplacing(null);
  }
};

const generatePrintableMenu = () => {
  const acceptedMeals = menu.filter(item => item.course);
  if (acceptedMeals.length === 0) return;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Your ${days}-Day Meal Plan</title>
      <style>
        body { font-family: Georgia, serif; max-width: 900px; margin: 40px auto; padding: 20px; background: white; }
        h1 { text-align: center; color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 12px; font-size: 2.2em; }
        .date { text-align: center; color: #555; margin-bottom: 30px; font-size: 1.2em; font-style: italic; }
        .meals-container { column-count: 2; column-gap: 40px; column-fill: balance; }
        .day { background: white; margin-bottom: 28px; padding: 18px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border-left: 6px solid #3498db; break-inside: avoid; width: 100%; box-sizing: border-box; }
        .day h2 { margin: 0 0 10px 0; color: #2c3e50; font-size: 1.5em; border-bottom: 1px solid #eee; padding-bottom: 6px; }
        .course-name { font-size: 1.6em; font-weight: bold; color: #e74c3c; margin: 18px 0 12px 0; }
        .sides-list { margin: 14px 0; padding-left: 0; list-style: none; font-size: 1.2em; line-height: 1.6; }
        .sides-list li { margin: 6px 0; }
        .footer { column-span: all; text-align: center; margin-top: 50px; padding-top: 20px; color: #777; font-size: 1.1em; font-style: italic; border-top: 1px solid #ddd; }
        @media print { body { margin: 0; padding: 1cm; } @page { size: A4 portrait; margin: 1cm; } }
      </style>
    </head>
    <body>
      <h1>Your ${days}-Day Meal Plan</h1>
      <p class="date">Planned on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <div class="meals-container">
        ${acceptedMeals.map(item => `
          <div class="day">
            <h2>Day ${item.day}</h2>
            <div class="course-name">${item.course.name}</div>

            ${item.sides?.length > 0 ? `
              <ul class="sides-list">
                ${item.sides.map(side => `<li>${side.name}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
        `).join('')}
      </div>

      <div class="footer">Bon appétit! Powered by MenuVerse</div>
    </body>
    </html>`;

  // ... rest of the function remains exactly the same (blob creation, window.open, etc.)
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');

    if (!printWindow) {
      URL.revokeObjectURL(url);
      alert('Please allow pop-ups for printing!');
      return;
    }

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };

    printWindow.onafterprint = () => {
      URL.revokeObjectURL(url);
      printWindow.close();
    };
  };

 const acceptMenu = async () => {
  // Collect all main course IDs
  const courseIds = menu
    .filter(item => item.course)
    .map(item => item.course.id);

  // Collect ALL side IDs that are currently in the menu
  const sideIds = menu
    .flatMap(item => item.sides || [])
    .map(side => side.id);

  if (courseIds.length === 0) {
    alert('No meals to accept!');
    return;
  }

  try {
    const response = await apiFetch("http://localhost:8080/api/menu/accept", {
        method: "POST",
        body: JSON.stringify({ courseIds, sideIds }),
      });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Server responded ${response.status}: ${text}`);
    }

    // Success
    generatePrintableMenu();
  } catch (err) {
    console.error('Error accepting menu:', err);
    alert('Could not save to server (you may see these meals again soon), but printing anyway...');
    generatePrintableMenu(); // Still print even if server fails
  }
};

    return (
    <div className="menu-container">
      <h1>Weekly Menu Planner</h1>

      {!days ? (
        <div className="selector-card">
          <label htmlFor="days">Number of days to plan?</label>
          <select
            id="days"
            onChange={(e) => fetchMenu(Number(e.target.value))}
            value=""
          >
            <option value="" disabled>
              Select days
            </option>
            {[1, 2, 3, 4, 5, 6, 7].map(n => (
              <option key={n} value={n}>
                {n} day{n > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <>
          <div className="menu-header">
            <h2>Your {days}-Day Menu</h2>
            <button
              className="change-days"
              onClick={() => {
                setDays(null);
                setMenu([]);
              }}
            >
              Change number of days
            </button>
            <button
              className="accept-menu"
              onClick={acceptMenu}
              disabled={loadingInitial || menu.some(item => item.loading || item.loadingSides)}
            >
              Accept & Print Menu
            </button>
          </div>

          {loadingInitial ? (
            <p className="loading-text">Loading your menu...</p>
          ) : (
            <div className="menu-grid">
              {menu.map((item, index) => (
                <div key={index} className="day-card">
                  <h3>Day {item.day}</h3>

                  {item.loading ? (
                    <p className="loading-text">Finding a new main course...</p>
                  ) : item.course ? (
                    <div className="course">
                      <h4>{item.course.name}</h4>
                        <div className="tags">
                        {item.course.category && (
                          <span className="tag tag-category">{item.course.category}</span>
                        )}
                        {item.course.origin && (
                          <span className="tag tag-origin">{item.course.origin}</span>
                        )}
                        {item.course.numsides > 0 && (
                          <span className="tag tag-sides">Sides: {item.course.numsides}</span>
                        )}
                      </div>

                      {/* SIDE DISHES */}
                      {item.loadingSides ? (
                        <p className="loading-text sides-loading">Loading sides...</p>
                      ) : item.sides?.length > 0 ? (
                        <div className="sides-section">
                          <h5>Sides:</h5>
                          <ul className="sides-list">
                            {item.sides.map((side, i) => (
                              <li key={i}>{side.name}</li>
                            ))}
                          </ul>
                        </div>
                      ) : item.course.numsides > 0 ? (
                        <p className="no-sides">No sides available right now</p>
                      ) : null}

                      <button
                        className="reject-btn"
                        onClick={() => rejectAndReplace(index)}
                        disabled={
                          item.loading ||
                          currentlyReplacing === index ||
                          item.loadingSides
                        }
                      >
                        {item.loading ? 'Finding...' : 'Suggest another main'}
                      </button>
                    </div>
                  ) : (
                    <p>No suggestion available</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Menu;