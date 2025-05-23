import React, { useEffect, useState } from "react";

const AdminManagement = () => {
  const [users, setUsers] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchRegistrations();
    fetchEvents();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:3001/users");
    const data = await res.json();
    setUsers(data);
  };

  const fetchRegistrations = async () => {
    const res = await fetch("http://localhost:3001/registrations");
    const data = await res.json();
    setRegistrations(data);
  };

  const fetchEvents = async () => {
    const res = await fetch("http://localhost:3001/events");
    const data = await res.json();
    setEvents(data);
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Da li ste sigurni da želite obrisati korisnika?")) {
      await fetch(`http://localhost:3001/users/${id}`, { method: "DELETE" });
      alert("Korisnik obrisan.");
      fetchUsers();
    }
  };

  const toggleBlockUser = async (user) => {
    await fetch(`http://localhost:3001/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blocked: !user.blocked }),
    });
    alert(`Korisnik je sada ${user.blocked ? "aktiviran" : "blokiran"}.`);
    fetchUsers();
  };

  const changeUserRole = async (user, newRole) => {
    await fetch(`http://localhost:3001/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    alert("Uloga korisnika promijenjena.");
    fetchUsers();
  };

  const updateRegistrationStatus = async (registration, status) => {
    await fetch(`http://localhost:3001/registrations/${registration.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    alert(`Prijava je ${status === "approved" ? "potvrđena" : "odbijena"}.`);
    fetchRegistrations();
  };

  const deleteRegistration = async (id) => {
    if (window.confirm("Da li ste sigurni da želite obrisati prijavu?")) {
      await fetch(`http://localhost:3001/registrations/${id}`, {
        method: "DELETE",
      });
      alert("Prijava je obrisana.");
      fetchRegistrations();
    }
  };

  const getEventTitle = (id) => {
    const ev = events.find((e) => e.id === id);
    return ev ? ev.title : "Nepoznat događaj";
  };

  const getUserByEmail = (email) => {
    return users.find((u) => u.email === email);
  };

  const translateStatus = (status) => {
    switch (status) {
      case "approved":
        return "potvrđeno";
      case "rejected":
        return "odbijeno";
      case "pending":
      default:
        return "na čekanju...";
    }
  };

  return (
    <div className="admin-management">
      <h2>Upravljanje korisnicima</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>Ime i prezime</th>
            <th>Email</th>
            <th>Uloga</th>
            <th className="status">Status</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} style={{ opacity: user.blocked ? 0.6 : 1 }}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => changeUserRole(user, e.target.value)}
                  disabled={user.blocked}
                >
                  <option value="user">Korisnik</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="status">{user.blocked ? "Blokiran" : "Aktivan"}</td>
              <td>
                <div className="actions">
                  <button
                    className={user.blocked ? "btn-activate" : "btn-block"}
                    onClick={() => toggleBlockUser(user)}
                  >
                    {user.blocked ? "Aktiviraj" : "Blokiraj"}
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Obriši
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Pregled i upravljanje prijavama na događaje</h2>
      <table className="registrations-table">
        <thead>
          <tr>
            <th>Događaj</th>
            <th>Korisnik</th>
            <th>Email</th>
            <th className="status">Status prijave</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((reg) => {
            const user = getUserByEmail(reg.email) || {};
            return (
              <tr key={reg.id}>
                <td>{getEventTitle(reg.eventId)}</td>
                <td>{reg.ime + " " + reg.prezime}</td>
                <td>{reg.email}</td>
                <td className="status">{translateStatus(reg.status)}</td>
                <td>
                  <div className="actions">
                    {(!reg.status || reg.status === "pending") &&
                      !user.blocked && (
                        <>
                          <button
                            className="btn-approve"
                            onClick={() =>
                              updateRegistrationStatus(reg, "approved")
                            }
                          >
                            Potvrdi
                          </button>
                          <button
                            className="btn-reject"
                            onClick={() =>
                              updateRegistrationStatus(reg, "rejected")
                            }
                          >
                            Odbij
                          </button>
                        </>
                      )}
                    <button
                      className="btn-delete-registration"
                      onClick={() => deleteRegistration(reg.id)}
                    >
                      Obriši prijavu
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminManagement;
