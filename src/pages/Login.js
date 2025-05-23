import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.email || !formData.email.includes("@")) {
      newErrors.email = "Unesite ispravan email.";
    }
    if (!formData.password) {
      newErrors.password = "Lozinka je obavezna.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/users?email=${encodeURIComponent(formData.email)}&password=${encodeURIComponent(formData.password)}`
      );
      const users = await response.json();

      if (users.length === 0) {
        throw new Error("Pogrešan email ili lozinka.");
      }

      alert("Uspješna prijava!");
      setErrors({});
      localStorage.setItem("user", JSON.stringify(users[0]));
      onLogin(users[0]);
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="form-container login-container">
      <h2 className="section-title">Prijava</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          className="form-input"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}

        <input
          className="form-input"
          type="password"
          placeholder="Lozinka"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        {errors.password && <p className="error-text">{errors.password}</p>}

        <button type="submit" className="cta-btn">Prijavi se</button>
      </form>

      <p className="form-footer-text">
        Nemate nalog?{" "}
        <Link to="/register" className="form-footer-link">
          Registrujte se ovdje.
        </Link>
      </p>
    </div>
  );
};

export default Login;
