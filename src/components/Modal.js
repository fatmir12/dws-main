import React from "react";

const Modal = ({ show, onClose, title, message }) => {
  if (!show) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.message}>{message}</p>
        <button style={styles.button} onClick={onClose}>U redu</button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    padding: "20px 30px",
    borderRadius: "8px",
    maxWidth: "400px",
    width: "90%",
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
    textAlign: "center",
  },
  title: {
    marginBottom: "15px",
  },
  message: {
    marginBottom: "25px",
    fontSize: "16px",
    color: "#333",
  },
  button: {
    backgroundColor: "#18BC9C", // 
    border: "none",
    color: "#f9f9f9",
    padding: "10px 20px",
    cursor: "pointer",
    borderRadius: "4px",
    fontWeight: "600",
    fontSize: "16px",
    transition: "background-color 0.3s ease",
  }
};

export default Modal;
