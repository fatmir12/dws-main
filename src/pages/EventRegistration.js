import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EventRegistration = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ime: "",
    prezime: "",
    email: "",
    telefon: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const registration = {
      ...formData,
      eventId,         
      status: "pending" 
    };

    try {
      await fetch("http://localhost:3001/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registration)
      });
      alert("Uspješno ste prijavljeni na događaj!");
      navigate("/events");
    } catch (err) {
      console.error("Greška pri prijavi:", err);
    }
  };

  return (
    <div className="registration-form">
      <h2>Prijava na događaj</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="ime"
          placeholder="Ime"
          value={formData.ime}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="prezime"
          placeholder="Prezime"
          value={formData.prezime}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="telefon"
          placeholder="Broj telefona"
          value={formData.telefon}
          onChange={handleChange}
          required
        />
        <button type="submit">Pošalji prijavu</button>
      </form>
    </div>
  );
};

export default EventRegistration;
