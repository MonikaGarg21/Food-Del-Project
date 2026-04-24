import React from "react";
import "./Header.css";
import {assets} from "../../assets/frontend_assets/assets";

const Header = () => {
  return (
    <section className="hero">
      <div className="hero__bg">
        <img
          src={assets.HeroSection}
          alt="Delicious food spread"
          className="hero__bg-img"
        />
        <div className="hero__bg-overlay" />
      </div>

      <div className="hero__content">
        {/* Badge */}
        <div className="hero__badge">
          <span className="hero__badge-dot" />
          Fast delivery · Fresh ingredients
        </div>

        <h1 className="hero__title">
          Order your
          <br />
          <span className="hero__title-accent">favourite food</span>
          <br />
          right here
        </h1>

        <p className="hero__desc">
          Choose from a diverse menu featuring delectable dishes crafted with
          the finest ingredients. One delicious meal at a time — delivered to
          your door.
        </p>

        <div className="hero__actions">
          <a href="#explore-menu" className="btn-primary hero__cta">
            Explore Menu →
          </a>
          <a href="#app-download" className="hero__secondary-cta">
            Get the app
          </a>
        </div>

        {/* Stats row */}
        <div className="hero__stats">
          {[
            {value: "50+", label: "Restaurants"},
            {value: "200+", label: "Menu items"},
            {value: "30 min", label: "Avg delivery"},
          ].map(({value, label}) => (
            <div className="hero__stat" key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Header;
