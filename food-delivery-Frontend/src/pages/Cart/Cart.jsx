import React, {useContext} from "react";
import "./Cart.css";
import {StoreContext} from "../../context/UseStoreContext";
import {useNavigate} from "react-router";
import {formatINR} from "../../uitls/formatINR";

const DELIVERY_FEE = 49; // ₹49 delivery fee

const Cart = () => {
  const {cartItems, food_list, removeFromCart, getTotalCartAmount, url} =
    useContext(StoreContext);
  const navigate = useNavigate();

  const subtotal = getTotalCartAmount();
  const total = subtotal + (subtotal > 0 ? DELIVERY_FEE : 0);

  const cartList = food_list.filter((item) => cartItems[item._id] > 0);
  const isEmpty = cartList.length === 0;

  return (
    <div className="cart">
      <div className="cart__header">
        <h1 className="section-title">Your Cart</h1>
        <p className="section-subtitle">
          {isEmpty
            ? "Your cart is empty — browse the menu to get started."
            : `${cartList.length} item${cartList.length > 1 ? "s" : ""} in your cart`}
        </p>
      </div>

      {isEmpty ? (
        <div className="cart__empty">
          <div className="cart__empty-icon">🛒</div>
          <p>Nothing here yet</p>
          <button className="btn-primary" onClick={() => navigate("/")}>
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="cart__layout">
          {/* ── Items ── */}
          <div className="cart__items card">
            <div className="cart__table-head">
              <span>Item</span>
              <span>Name</span>
              <span>Price</span>
              <span>Qty</span>
              <span>Total</span>
              <span></span>
            </div>

            {cartList.map((item) => (
              <div className="cart__row" key={item._id}>
                <img
                  src={url + "/images/" + item.image}
                  alt={item.name}
                  className="cart__item-img"
                />
                <p className="cart__item-name">{item.name}</p>
                <p className="cart__item-price">{formatINR(item.price)}</p>
                <span className="cart__item-qty">{cartItems[item._id]}</span>
                <p className="cart__item-total">
                  {formatINR(item.price * cartItems[item._id])}
                </p>
                <button
                  className="cart__remove"
                  onClick={() => removeFromCart(item._id)}
                  aria-label={`Remove ${item.name}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* ── Summary ── */}
          <div className="cart__sidebar">
            <div className="cart__summary card">
              <h2 className="cart__summary-title">Order Summary</h2>

              <div className="cart__summary-row">
                <span>Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="cart__summary-row">
                <span>Delivery fee</span>
                <span>{subtotal > 0 ? formatINR(DELIVERY_FEE) : "—"}</span>
              </div>
              <div className="cart__summary-divider" />
              <div className="cart__summary-row cart__summary-row--total">
                <span>Total</span>
                <span>{formatINR(total)}</span>
              </div>

              <button
                className="btn-primary cart__checkout-btn"
                onClick={() => navigate("/order")}
              >
                Proceed to Checkout →
              </button>
            </div>

            {/* Promo */}
            <div className="cart__promo card">
              <p className="cart__promo-label">Have a promo code?</p>
              <div className="cart__promo-row">
                <input
                  type="text"
                  placeholder="Enter code"
                  className="cart__promo-input"
                />
                <button className="btn-outline cart__promo-btn">Apply</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
