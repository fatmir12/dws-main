import React, { useState, useEffect } from "react";

const AdminPanel = () => {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "",
    date: "",
    image: "",
  });
  const [editId, setEditId] = useState(null);

  const fetchEvents = async () => {
    const res = await fetch("http://localhost:3001/events");
    const data = await res.json();
    setEvents(data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eventData = {
      title: form.title,
      description: form.description,
      type: form.type,
      date: form.date,
      image: form.image || "https://via.placeholder.com/400x200",
    };

    if (editId) {
      await fetch(`http://localhost:3001/events/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });
      alert("Uspješno ste izmijenili event.");
      setEditId(null);
    } else {
      await fetch("http://localhost:3001/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });
      alert("Uspješno ste dodali event.");
    }

    setForm({ title: "", description: "", type: "", date: "", image: "" });
    fetchEvents();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Da li ste sigurni da želite obrisati događaj?")) {
      await fetch(`http://localhost:3001/events/${id}`, {
        method: "DELETE",
      });
      alert("Uspješno ste obrisali event.");
      fetchEvents();
    }
  };

  const handleEdit = (event) => {
    setForm({
      title: event.title,
      description: event.description,
      type: event.type,
      date: event.date,
      image: event.image || "",
    });
    setEditId(event.id);
  };

  return (
    <div className="admin-panel">
      <h2><b>Administracija Događaja</b></h2>

      <form className="admin-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Naslov događaja"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Opis događaja"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          required
        >
          <option value="">Odaberi vrstu događaja</option>
          <option value="konferencija">Konferencija</option>
          <option value="koncert">Koncert</option>
          <option value="meetup">Meetup</option>
          <option value="festival">Festival</option>
          <option value="radionica">Radionica</option>
        </select>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="URL slike (opcionalno)"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />
        <button type="submit">{editId ? "Izmijeni" : "Dodaj"} događaj</button>
      </form>

      <div className="admin-event-list">
        <h3>Lista događaja</h3>
        {events.map((event) => (
          <div key={event.id} className="admin-event-item">
            <strong>{event.title}</strong> ({event.type}) - {event.date}
            <div>
              <button onClick={() => handleEdit(event)}>Uredi</button>
              <button onClick={() => handleDelete(event.id)}>Obriši</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
