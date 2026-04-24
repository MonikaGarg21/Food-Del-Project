import React, {useContext, useEffect, useState} from "react";
import "./MyOrder.css";
import {StoreContext} from "../../context/UseStoreContext";
import axios from "axios";

const MyOrder = () => {
  const {url, token} = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    if (token) {
      // Fetch Orders
      const fetchOrders = async () => {
        try {
          const response = await axios.get(`${url}/api/order/userorders`, {
            headers: {
              token: token,
            },
          });

          if (response.data.success) {
            setOrders(response.data.data);
          }
        } catch (error) {
          console.log("Error fetching orders:", error);
        }
      };
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p className="no-orders">No orders found</p>
      ) : (
        orders.map((order, index) => (
          <div className="order-card" key={index}>
            <div className="order-header">
              <h3>Order #{order._id.slice(-6)}</h3>
              <span className="status">{order.status}</span>
            </div>

            <div className="order-items">
              {order.items.map((item, i) => (
                <div className="order-item" key={i}>
                  <img src={`${url}/images/${item.image}`} alt={item.name} />
                  <div>
                    <p className="item-name">{item.name}</p>
                    <p>Qty: {item.quantity}</p>
                    <p>₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-details">
              <p>
                <strong>Total:</strong> ₹{order.amount}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(order.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Payment:</strong> {order.payment ? "Paid" : "Pending"}
              </p>
            </div>

            <div className="order-footer">
              <button
                className="track-btn"
                onClick={() => alert(`Tracking Order ID: ${order._id}`)}
              >
                Track Order
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrder;
