import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import "./App.css";
import logo from "./assets/menuverse.png";

// Import your components
import MainCourseList from "./assets/MainCourseList.jsx";
import SideItemList from "./assets/SideItemList.jsx";
import SearchWeb from "./assets/SearchWeb.jsx";
import MealDetail from "./assets/MealDetail.jsx"; 
import About from "./assets/About.jsx"; 
import Menu from "./assets/Menu.jsx";
import ContactWithPdf from "./components/ContactWithPdf.jsx";

// New imports
import Login from "./assets/Login.jsx";
import Register from "./assets/Register.jsx";

// ProtectedLayout: Wraps the main app and checks for token
function ProtectedLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  return <Layout />;
}

// Layout Component (contains sidebar + main content) - mostly unchanged, but add logout handling
function Layout() {
  const [active, setActive] = useState("home");
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveFromPath = () => {
    const currentPath = location.pathname;

    // Special case: meal detail belongs to search
    if (currentPath.startsWith("/meal/")) return "search";

    // Find which button matches the current path
    const activeButton = buttons.find(btn => {
      // Exact match for root
      if (btn.path === "/" && (currentPath === "/" || currentPath === "")) return true;
      // Otherwise check if path starts with the button's path
      return btn.path !== "/" && currentPath.startsWith(btn.path);
    });

    return activeButton ? activeButton.id : "home";
  };

  const buttons = [
    { id: "home", label: "Home", path: "/" },
    { id: "maincourse", label: "Main Courses", path: "/maincourse" },
    { id: "sideitem", label: "Side Items", path: "/sideitem" },
    { id: "search", label: "Search Web", path: "/search" },
    { id: "menu", label: "Menu", path: "/menu" },
    { id: "about", label: "About", path: "/about" },
    { id: "contact", label: "Contact", path: "/contact" },
    { id: "logout", label: "Logout", path: "#" }, // New logout button
  ];

  // Update active tab when navigating
  const handleNavClick = (id, path) => {
    if (id === "logout") {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }
    setActive(id);
    navigate(path);
  };

  // Determine current active tab
  const currentActive = location.pathname.includes("/meal/") ? "search" : getActiveFromPath();

  return (
    <div className="app-container">
      {/* Logo Header */}
      <header className="logo-header">
        <img src={logo} alt="Menuverse" className="logo" />
      </header>

      <div className="layout">
        {/* Sidebar */}
        <aside className="sidebar">
          {buttons.map((btn) => (
            <button
              key={btn.id}
              className={`nav-btn ${currentActive === btn.id ? "active" : ""}`}
              onClick={() => handleNavClick(btn.id, btn.path)}
            >
              {btn.label}
            </button>
          ))}
        </aside>

        {/* Main Content Area */}
        <main className="main">
          <h1 className="app-title">Menuverse</h1>
          <section className="content">
            <Routes>
              {/* Home */}
              <Route
                path="/"
                element={
                  <div className="content-block">
                    <h2>Welcome to Menuverse</h2>
                    <p>Explore meals, search the web, or manage your menu!</p>
                    <img class="main-logo" src={logo} alt={"Main Logo"} onClick={() => navigate('/about')}/>
                  </div>
                }
              />

              <Route path="/about" element={<About />} />
              <Route path="/menu" element={<Menu />} />

              <Route path="/maincourse" element={<MainCourseList />} />
              <Route path="/sideitem" element={<SideItemList />} />
              <Route path="/contact" element={<ContactWithPdf />} />

              <Route path="/search" element={<SearchWeb />} />
              <Route path="/meal/:id" element={<MealDetail />} />
            </Routes>
          </section>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={<ProtectedLayout />} /> {/* All other routes are protected */}
      </Routes>
    </BrowserRouter>
  );
}