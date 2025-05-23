import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    role: "user",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.email || !formData.email.includes("@")) {
      newErrors.email = "Unesite ispravan email.";
    }
    if (!formData.name) {
      newErrors.name = "Ime je obavezno.";
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Lozinka mora imati najmanje 6 karaktera.";
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
      const response = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Greška prilikom registracije.");
      }

      alert("Registracija uspješna! Molimo prijavite se.");
      setFormData({ email: "", name: "", password: "", role: "user" });
      setErrors({});
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="form-container register-container">
      <h2 className="section-title">Registracija</h2>
      <form className="register-form" onSubmit={handleSubmit}>
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
          type="text"
          placeholder="Ime"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        {errors.name && <p className="error-text">{errors.name}</p>}

        <input
          className="form-input"
          type="password"
          placeholder="Lozinka"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        {errors.password && <p className="error-text">{errors.password}</p>}

        <button type="submit" className="cta-btn">Registruj se</button>
      </form>

      <p className="form-footer-text">
        Već imate nalog?{" "}
        <Link to="/login" className="form-footer-link">
          Prijavite se ovdje.
        </Link>
      </p>
    </div>
  );
};

export default Register;
