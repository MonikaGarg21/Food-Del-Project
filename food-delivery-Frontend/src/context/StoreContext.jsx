import {useEffect, useState, useCallback} from "react";
import {StoreContext} from "./UseStoreContext";
import axios from "axios";

const BASE_URL = "http://localhost:4000";

// Axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
});

const StoreContextProvider = ({children}) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [food_list, setFoodList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Attach token to every request automatically
  useEffect(() => {
    const interceptor = api.interceptors.request.use((config) => {
      if (token) config.headers.token = token;
      return config;
    });
    return () => api.interceptors.request.eject(interceptor);
  }, [token]);

  // Persist token to localStorage whenever it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const fetchFoodList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const {data} = await api.get("/api/food/list");
      setFoodList(data.data);
    } catch (err) {
      setError("Failed to load food items. Please try again.");
      console.error("fetchFoodList error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCartFromServer = useCallback(async () => {
    if (!token) return;
    try {
      const {data} = await api.get("/api/cart/get");
      setCartItems(data.cartData || {});
    } catch (err) {
      console.error("fetchCart error:", err);
    }
  }, [token]);

  // Load food list and cart on mount / token change
  useEffect(() => {
    fetchFoodList();
    fetchCartFromServer();
  }, [fetchFoodList, fetchCartFromServer]);

  const addToCart = useCallback(
    async (itemId) => {
      // Optimistic update
      setCartItems((prev) => ({
        ...prev,
        [itemId]: (prev[itemId] || 0) + 1,
      }));

      if (token) {
        try {
          await api.post("/api/cart/add", {itemId});
        } catch (err) {
          // Rollback on failure
          setCartItems((prev) => {
            const updated = {...prev};
            if (updated[itemId] > 1) updated[itemId] -= 1;
            else delete updated[itemId];
            return updated;
          });
          console.error("addToCart error:", err);
        }
      }
    },
    [token],
  );

  const removeFromCart = useCallback(
    async (itemId) => {
      // Snapshot for rollback
      const snapshot = {...cartItems};

      setCartItems((prev) => {
        const updated = {...prev};
        if (updated[itemId] > 1) updated[itemId] -= 1;
        else delete updated[itemId];
        return updated;
      });

      if (token) {
        try {
          await api.delete("/api/cart/remove", {data: {itemId}});
        } catch (err) {
          setCartItems(snapshot); // Rollback
          console.error("removeFromCart error:", err);
        }
      }
    },
    [token, cartItems],
  );

  const clearCart = useCallback(() => {
    setCartItems({});
  }, []);

  const getTotalCartAmount = useCallback(() => {
    return Object.entries(cartItems).reduce((total, [id, qty]) => {
      const item = food_list.find((p) => p._id === id);
      return item && qty > 0 ? total + item.price * qty : total;
    }, 0);
  }, [cartItems, food_list]);

  const getTotalCartItems = useCallback(() => {
    return Object.values(cartItems).reduce((total, qty) => total + qty, 0);
  }, [cartItems]);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalCartAmount,
    getTotalCartItems,
    url: BASE_URL,
    token,
    setToken,
    loading,
    error,
    refetchFoodList: fetchFoodList,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
