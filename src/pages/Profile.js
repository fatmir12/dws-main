import React, { useEffect, useRef, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const fileInputRef = useRef();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        const storedImage = localStorage.getItem(`userImage_${parsedUser.id}`);
        if (storedImage) {
          setImageUrl(storedImage);
        }
      } catch (e) {
        console.error("Neuspjelo parsiranje korisnika iz localStorage", e);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Dozvoljene su samo slike.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Slika ne smije biti veća od 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      localStorage.setItem(`userImage_${user.id}`, base64Image);
      setImageUrl(base64Image);

      const updatedUser = { ...user, profilnaSlika: base64Image };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      fetch(`http://localhost:3001/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      }).catch((error) => {
        console.error("Greška prilikom ažuriranja slike:", error);
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteImage = () => {
    if (!user) return;

    const confirmDelete = window.confirm("Da li ste sigurni da želite izbrisati profilnu sliku?");
    if (!confirmDelete) return;

    localStorage.removeItem(`userImage_${user.id}`);

    const updatedUser = { ...user };
    delete updatedUser.profilnaSlika;

    setUser(updatedUser);
    setImageUrl("");
    localStorage.setItem("user", JSON.stringify(updatedUser));

    fetch(`http://localhost:3001/users/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    }).catch((error) => {
      console.error("Greška prilikom brisanja slike:", error);
    });
  };

  const handleDelete = async () => {
    if (!user) return;

    const confirmDelete = window.confirm("Da li ste sigurni da želite izbrisati profil?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3001/users/${user.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Profil uspješno izbrisan.");
        localStorage.removeItem("user");
        localStorage.removeItem(`userImage_${user.id}`);
        window.location.href = "/";
      } else {
        alert("Greška prilikom brisanja profila.");
      }
    } catch (error) {
      console.error("Greška:", error);
      alert("Došlo je do greške.");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("Molimo ispunite sva polja za promjenu lozinke.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Nova lozinka i potvrda lozinke se ne poklapaju.");
      return;
    }

    if (oldPassword !== user.password) {
      alert("Stara lozinka nije ispravna.");
      return;
    }

    try {
      const updatedUser = { ...user, password: newPassword };

      const response = await fetch(`http://localhost:3001/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        alert("Lozinka uspješno promijenjena.");
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        alert("Greška prilikom promjene lozinke.");
      }
    } catch (error) {
      console.error("Greška:", error);
      alert("Došlo je do greške.");
    }
  };

  if (!user) {
    return (
      <div className="profile-container">
        <h2>Niste prijavljeni.</h2>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2>Moj profil</h2>

      <img
        src={
          imageUrl ||
          user.profilnaSlika ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
        }
        alt="Avatar"
        className="profile-avatar"
      />

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button className="change-image-button" onClick={triggerFileInput}>
          Promijeni profilnu sliku
        </button>
        {(imageUrl || user.profilnaSlika) && (
          <button className="delete-image-button" onClick={handleDeleteImage}>
            Izbriši profilnu sliku
          </button>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={fileInputRef}
        style={{ display: "none" }}
      />

      <h3 className="user-info-title">Informacije o korisniku</h3>

      <div className="profile-info" style={{ justifyContent: "flex-start" }}>
        <i className="fas fa-user icon" style={{ marginRight: "10px", color: "#333" }}></i>
        <span>{user.name}</span>
      </div>

      <div className="profile-info">
        <i className="fas fa-envelope icon"></i>
        <span>{user.email}</span>
      </div>

      <div className="profile-info">
        <i className="fas fa-user-tag icon"></i>
        <span>{user.role}</span>
      </div>

      <div className="password-section">
        <h3>Promjena lozinke</h3>
        <form className="change-password-form" onSubmit={handleChangePassword}>
          <input
            type="password"
            placeholder="Stara lozinka"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Nova lozinka"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Potvrdi novu lozinku"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="password-button">
            Promijeni lozinku
          </button>
        </form>
      </div>

      <button className="delete-button" onClick={handleDelete}>
        Izbriši profil
      </button>
    </div>
  );
};

export default Profile;
