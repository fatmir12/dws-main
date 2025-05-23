import React from "react";

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero">
        <h1>Dobrodošli na Eventify</h1>
        <p>Organizuj i prati događaje brzo i jednostavno.</p>
        <a href="/Events" className="cta-button-hero">
          🔍 Istraži događaje
        </a>
      </section>

      <section className="how-it-works">
        <h2>Kako funkcioniše?</h2>
        <div className="steps">
          <div className="step">
            <span className="icon">📝</span>
            <h3>1. Registruj se</h3>
            <p>Kreiraj nalog za pristup svim funkcijama Eventify platforme.</p>
          </div>
          <div className="step">
            <span className="icon">🔍</span>
            <h3>2. Pregledaj događaje</h3>
            <p>Pretraži događaje po vrsti, datumu ili lokaciji.</p>
          </div>
          <div className="step">
            <span className="icon">✅</span>
            <h3>3. Prijavi se</h3>
            <p>Prijavi se na događaje koji te zanimaju jednim klikom.</p>
          </div>
          <div className="step">
            <span className="icon">🎉</span>
            <h3>4. Uživaj</h3>
            <p>Prisustvuj događajima i upoznaj nove ljude!</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
