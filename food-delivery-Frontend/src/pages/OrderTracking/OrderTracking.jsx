import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { StoreContext } from "../../context/UseStoreContext";
import "./OrderTracking.css";

const steps = ["Food Proccessing", "Out for delivery", "Delivered"];

const OrderTracking = () => {
  const { id } = useParams();
  const { url, token } = useContext(StoreContext);

  const [order, setOrder] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const audioRef = useRef(null);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${url}/api/order/track/${id}`, {
        headers: { token },
      });

      if (res.data.success) {
        const data = res.data.data;
        setOrder(data);

        const stepIndex = steps.indexOf(data.status);
        const newProgress = ((stepIndex + 1) / steps.length) * 100;

        setProgress(newProgress);

        // 🔔 play sound when delivered
        if (data.status === "Delivered") {
          setShowSuccess(true);
          audioRef.current?.play();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrder();
      const interval = setInterval(fetchOrder, 5000);
      return () => clearInterval(interval);
    }
  }, [id, token]);

  if (!order) return <div className="loader"></div>;

  return (
    <div className="tracking-bg">
      <div className="tracking-card">
        <h2 className="title">Track Your Order 🚀</h2>

        {/* 🔔 Audio */}
        <audio ref={audioRef} src="/delivery.mp3" />

        {/* 🚚 Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>

          {/* Truck */}
          <div className="truck" style={{ left: `${progress}%` }}>
            🚚
          </div>
        </div>

        {/* Steps */}
        <div className="steps">
          {steps.map((step, index) => {
            const active = steps.indexOf(order.status) >= index;

            return (
              <div
                className={`step ${active ? "active-step" : ""}`}
                key={index}
              >
                <div className="dot"></div>
                <p>{step}</p>
              </div>
            );
          })}
        </div>

        {/* 📍 Map (simple demo location) */}
        {order.status === "Out for delivery" && (
          <div className="map">
            <iframe
              title="map"
              src="https://maps.google.com/maps?q=28.6139,77.2090&z=15&output=embed"
            ></iframe>
          </div>
        )}

        {/* 🎉 Success */}
        {showSuccess && (
          <div className="success-popup">
            <div className="success-box">🎉 Order Delivered Successfully!</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
