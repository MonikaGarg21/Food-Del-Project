import React from "react";
import "./AppDownload.css";
import {assets} from "../../assets/frontend_assets/assets";

const AppDownload = () => {
  return (
    <section className="app-download" id="app-download">
      <div className="app-download__content">
        <div className="app-download__text">
          <span className="app-download__eyebrow">Mobile App</span>
          <h2 className="app-download__title">
            Order faster with
            <br />
            our mobile app
          </h2>
          <p className="app-download__desc">
            Track your order in real time, save your favourite restaurants, and
            get exclusive app-only deals. Available on iOS & Android.
          </p>
          <div className="app-download__badges">
            <a href="#" className="app-download__badge-link">
              <img src={assets.play_store} alt="Get it on Google Play" />
            </a>
            <a href="#" className="app-download__badge-link">
              <img src={assets.app_store} alt="Download on the App Store" />
            </a>
          </div>
        </div>

        <div className="app-download__visual">
          <div className="app-download__phone-mockup">
            <img src={assets.MobileView} alt="" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;
