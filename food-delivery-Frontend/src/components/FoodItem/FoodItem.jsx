import React, {useContext} from "react";
import "./FoodItem.css";
import {assets} from "../../assets/frontend_assets/assets";
import {StoreContext} from "../../context/UseStoreContext";
import {formatINR} from "../../uitls/formatINR.js";

const FoodItem = ({id, name, price, description, image}) => {
  const {cartItems, addToCart, removeFromCart, url} = useContext(StoreContext);
  const count = cartItems[id] || 0;

  return (
    <div className="food-item">
      <div className="food-item__img-wrap">
        <img
          className="food-item__img"
          src={url + "/images/" + image}
          alt={name}
          loading="lazy"
        />

        {/* Overlay gradient */}
        <div className="food-item__overlay" />

        {/* Add / Counter */}
        <div className="food-item__cart-control">
          {count === 0 ? (
            <button
              className="food-item__add-btn"
              onClick={() => addToCart(id)}
              aria-label={`Add ${name} to cart`}
            >
              <span>+</span> Add
            </button>
          ) : (
            <div className="food-item__counter">
              <button
                onClick={() => removeFromCart(id)}
                aria-label="Remove one"
              >
                −
              </button>
              <span>{count}</span>
              <button onClick={() => addToCart(id)} aria-label="Add one more">
                +
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="food-item__info">
        <div className="food-item__name-row">
          <h3 className="food-item__name">{name}</h3>
          <img
            src={assets.rating_starts}
            alt="Rating"
            className="food-item__stars"
          />
        </div>
        <p className="food-item__desc">{description}</p>
        <p className="food-item__price">{formatINR(price)}</p>
      </div>
    </div>
  );
};

export default FoodItem;
