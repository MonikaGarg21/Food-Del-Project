import React, {useContext, useState} from "react";
import "./LoginPopup.css";
import {assets} from "../../assets/frontend_assets/assets";
import {StoreContext} from "../../context/UseStoreContext";
import axios from "axios";

const LoginPopup = ({setShowLogin}) => {
  const [currState, setCurrState] = useState("Sign Up");
  const {url, setToken} = useContext(StoreContext);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({...data, [name]: value}));
  };
  const onLogin = async (e) => {
    try {
      e.preventDefault();
      let newUrl = url;
      if (currState === "Login") {
        newUrl += "/api/user/login";
      } else {
        newUrl += "/api/user/register";
      }

      const response = await axios.post(newUrl, data);
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setShowLogin(false);
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className="login-overlay"
      onClick={(e) => e.target === e.currentTarget && setShowLogin(false)}
      role="dialog"
      aria-modal="true"
      aria-label={currState}
    >
      <div className="login-modal">
        {/* Header */}
        <div className="login-modal__header">
          <div>
            <h2 className="login-modal__title">{currState}</h2>
            <p className="login-modal__sub">
              {currState === "Sign Up"
                ? "Create your account to start ordering"
                : "Welcome back! Sign in to continue"}
            </p>
          </div>
          <button
            className="login-modal__close"
            onClick={() => setShowLogin(false)}
            aria-label="Close"
          >
            <img src={assets.cross_icon} alt="Close" width="14" />
          </button>
        </div>

        {/* Form */}
        <form className="login-modal__form" onSubmit={onLogin}>
          {currState === "Sign Up" && (
            <div className="login-field">
              <label>Full name</label>
              <input
                type="text"
                value={data.name}
                name="name"
                onChange={(e) => onChangeHandler(e)}
                placeholder="Rahul Sharma"
                required
              />
            </div>
          )}

          <div className="login-field">
            <label>Email address</label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={(e) => onChangeHandler(e)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="login-field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={(e) => onChangeHandler(e)}
              placeholder="••••••••"
              required
            />
          </div>

          {/* Terms */}
          <label className="login-modal__terms">
            <input type="checkbox" required />
            <span>
              I agree to the <a href="#terms">Terms of Service</a> &amp;{" "}
              <a href="#privacy">Privacy Policy</a>
            </span>
          </label>

          <button type="submit" className="btn-primary login-modal__submit">
            {currState === "Sign Up" ? "Create Account" : "Sign In"}
          </button>
        </form>

        {/* Toggle */}
        <p className="login-modal__toggle">
          {currState === "Login" ? (
            <>
              Don't have an account?{" "}
              <span onClick={() => setCurrState("Sign Up")}>Sign up</span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span onClick={() => setCurrState("Login")}>Sign in</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default LoginPopup;
