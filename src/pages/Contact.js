import React, { useState } from 'react';
import Modal from '../components/Modal';


const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [modalVisible, setModalVisible] = useState(false);

  const isLoggedIn = () => {
    const user = localStorage.getItem('user');
    return user !== null && user !== undefined && user !== '';
  };

  const handleChange = (e) => {
    if (!isLoggedIn()) {
      setModalVisible(true);
      return;
    }

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isLoggedIn()) {
      setModalVisible(true);
      return;
    }

    console.log('Poruka poslana:', formData);

    alert('Poruka uspješno poslana!');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <>
      <div className="contact-container">
        <h2 className="section-title">Kontaktirajte nas</h2>
        <form onSubmit={handleSubmit} className="contact-form">
          <input
            type="text"
            name="name"
            placeholder="Vaše ime"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Vaš email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            required
          />
          <textarea
            name="message"
            placeholder="Vaša poruka"
            value={formData.message}
            onChange={handleChange}
            className="form-input"
            rows="5"
            required
          ></textarea>
          <button type="submit" className="cta-btn">Pošalji</button>
        </form>

        <div className="map-container">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1011.2926389211485!2d17.90342874435829!3d44.19949627311694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475ee2423fa0fbaf%3A0xd5caf50678c02195!2sPolitehni%C4%8Dki%20fakultet%20Univerziteta%20u%20Zenici!5e0!3m2!1sen!2sba!4v1747932513551!5m2!1sen!2sba"  loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>

      <Modal
        show={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Niste prijavljeni"
        message="Molimo prijavite se kako biste mogli poslati poruku putem kontakt forme."
      />
    </>
  );
};

export default Contact;
