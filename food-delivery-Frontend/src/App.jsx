import { useState, useEffect, useContext } from "react";
import Navbar from "./components/Navbar/Navbar.jsx";
import { Route, Routes } from "react-router";
import Home from "./pages/Home/Home.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder.jsx";
import Footer from "./components/Footer/Footer.jsx";
import LoginPopup from "./components/LoginPopup/LoginPopup.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import MyOrder from "./pages/MyOrders/MyOrder.jsx";
import Chatbot from "./components/Chatbot/Chatbot.jsx";
import Search from "./components/Search/Search.jsx";
import { StoreContext } from "./context/UseStoreContext.js";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const { food_list } = useContext(StoreContext);

  useEffect(() => {
    document.body.style.overflow = showLogin ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showLogin]);

  return (
    <>
      <ScrollToTop />

      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}

      <div className="app">
        <Navbar setShowLogin={setShowLogin} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/myorders" element={<MyOrder />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </div>
      <Chatbot food_list={food_list} />
      <Footer />
    </>
  );
};

export default App;
