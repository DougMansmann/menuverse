import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";
import logo from "./menuverse.png";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [copyGeneric, setCopyGeneric] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Password validation function
  const validatePassword = (pwd) => {
    const minLength = pwd.length >= 8;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);

    if (!minLength) return "Password must be at least 8 characters long.";
    if (!hasUpper) return "Password must contain at least one uppercase letter.";
    if (!hasLower) return "Password must contain at least one lowercase letter.";
    if (!hasNumber) return "Password must contain at least one number.";
    if (!hasSpecial) return "Password must contain at least one special character (!@#$%^&* etc.).";
    return null; // Valid
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Check password strength
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    // Check confirmation match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email, copyGeneric }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Registration failed. Username or email may be taken."
        );
      }

      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="register-container"
      style={{ backgroundImage: `url(${logo})` }}
    >
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
            placeholder="Min 8 chars, upper/lowercase, number, special char"
          />
        </div>

        <div className="field-row">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className="field-row checkbox-row">
          <label>Copy generic main and side items?</label>
          <input
            type="checkbox"
            checked={copyGeneric}
            onChange={(e) => setCopyGeneric(e.target.checked)}
          />
        </div>

        <button type="submit" className="fetch-btn">Register</button>
      </form>

      <p className="password-hint">
        Password must include:
        <br />
        • At least 8 characters
        <br />
        • One uppercase & one lowercase letter
        <br />
        • One number
        <br />
        • One special character (!@#$%^&* etc.)
      </p>

      <p>
        Already have an account? <Link to="/login">Login here</Link>.
      </p>
    </div>
  );
}