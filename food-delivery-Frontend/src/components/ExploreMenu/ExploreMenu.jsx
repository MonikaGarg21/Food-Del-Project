import React from "react";
import "./ExploreMenu.css";
import {menu_list} from "../../assets/frontend_assets/assets";

const ExploreMenu = ({category, setCategory}) => {
  return (
    <section className="explore-menu" id="explore-menu">
      <div className="explore-menu__header">
        <h2 className="section-title">Explore our menu</h2>
        <p className="section-subtitle">
          Browse by category and find your next favourite dish
        </p>
      </div>

      <div className="explore-menu__track">
        {menu_list.map((item) => (
          <button
            key={item.menu_name}
            className={`explore-menu__pill ${
              category === item.menu_name ? "active" : ""
            }`}
            onClick={() =>
              setCategory((prev) =>
                prev === item.menu_name ? "All" : item.menu_name,
              )
            }
          >
            <div
              className={`explore-menu__pill-img ${
                category === item.menu_name ? "active" : ""
              }`}
            >
              <img src={item.menu_image} alt={item.menu_name} />
            </div>
            <span>{item.menu_name}</span>
          </button>
        ))}
      </div>

      <div className="explore-menu__divider" />
    </section>
  );
};

export default ExploreMenu;
