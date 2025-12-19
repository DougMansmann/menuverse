import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css"; // Updated import

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  // NEW: State for checkbox, default true (checked)
  const [copyGeneric, setCopyGeneric] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // UPDATED: Include copyGeneric in the body
        body: JSON.stringify({ username, password, email, copyGeneric }),
      });
      if (!response.ok) {
        throw new Error("Registration failed. Username or email may be taken.");
      }
      alert("Registration successful! Please log in.");
      navigate("/login"); // Redirect to login after success
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    // UPDATED: Changed className to match new CSS
    <div className="register-container">
      <h2>Register for Menuverse</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="field-row">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="field-row">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="field-row">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {/* NEW: Checkbox field */}
        <div className="field-row">
          <label>Copy generic main and side items?</label>
          <input
            type="checkbox"
            checked={copyGeneric}
            onChange={(e) => setCopyGeneric(e.target.checked)}
          />
        </div>
        <button type="submit" className="fetch-btn">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>.
      </p>
    </div>
  );
}