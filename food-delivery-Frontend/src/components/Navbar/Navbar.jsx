import React, {useContext, useState, useEffect} from "react";
import "./Navbar.css";
import {assets} from "../../assets/frontend_assets/assets";
import {Link, useNavigate} from "react-router-dom";
import {StoreContext} from "../../context/UseStoreContext";
import {User} from "lucide-react";
import {ShoppingCart} from "lucide-react";
import {Search} from "lucide-react";
import {Handbag} from "lucide-react";
import {LogOut} from "lucide-react";

const Navbar = ({setShowLogin}) => {
  const [menu, setMenu] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const {getTotalCartItems, token, setToken} = useContext(StoreContext);
  const navigate = useNavigate();
  const logout = () => {
    console.log("Hello");
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const cartCount = getTotalCartItems();

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo" onClick={() => setMenu("home")}>
          <img src={assets.logo1} alt="Tomato" />
        </Link>

        <ul className="navbar__links">
          {[
            {label: "Home", key: "home", to: "/", hash: false},
            {label: "Menu", key: "menu", to: "/#explore-menu", hash: true},
            {
              label: "Mobile App",
              key: "mobile-app",
              to: "/#app-download",
              hash: true,
            },
            {label: "Contact", key: "contact-us", to: "/#footer", hash: true},
          ].map(({label, key, to, hash}) => (
            <li key={key}>
              {hash ? (
                <a
                  href={to}
                  onClick={() => setMenu(key)}
                  className={menu === key ? "active" : ""}
                >
                  {label}
                </a>
              ) : (
                <Link
                  to={to}
                  onClick={() => setMenu(key)}
                  className={menu === key ? "active" : ""}
                >
                  {label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="navbar__actions">
          <button className="navbar__icon-btn" aria-label="Search">
            <Search />
          </button>

          <Link to="/cart" className="navbar__cart" aria-label="Cart">
            <ShoppingCart />
            {cartCount > 0 && (
              <span className="navbar__cart-badge">{cartCount}</span>
            )}
          </Link>

          {!token ? (
            <button
              className="btn-primary"
              onClick={() => {
                setShowLogin(true);
                setMobileOpen(false);
              }}
            >
              Sign in
            </button>
          ) : (
            <div className="navbar-profile">
              <User />
              <ul className="nav-profile-dropdown">
                <li onClick={() => navigate("/myorders")}>
                  <Handbag />
                  <p>Orders</p>
                </li>
                <hr />
                <li onClick={() => logout()}>
                  <LogOut />
                  <p>Logout</p>
                </li>
              </ul>
            </div>
          )}

          <button
            className={`navbar__hamburger ${mobileOpen ? "open" : ""}`}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="navbar__mobile-drawer">
          {[
            {label: "Home", key: "home", to: "/"},
            {label: "Menu", key: "menu", href: "#explore-menu"},
            {label: "Mobile App", key: "mobile-app", href: "#app-download"},
            {label: "Contact", key: "contact-us", href: "#footer"},
          ].map(({label, key, to, href}) =>
            to ? (
              <Link key={key} to={to} onClick={() => setMenu(key)}>
                {label}
              </Link>
            ) : (
              <a key={key} href={href} onClick={() => setMenu(key)}>
                {label}
              </a>
            ),
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
