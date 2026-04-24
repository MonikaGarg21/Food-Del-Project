import React, {useContext} from "react";
import "./FoodDisplay.css";
import {StoreContext} from "../../context/UseStoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({category}) => {
  const {food_list} = useContext(StoreContext);

  const filtered = food_list.filter(
    (item) => category === "All" || item.category === category,
  );

  return (
    <section className="food-display" id="food-display">
      <div className="food-display__header">
        <h2 className="section-title">
          {category === "All" ? "Top dishes near you" : category}
        </h2>
        <p className="section-subtitle">
          {filtered.length} item{filtered.length !== 1 ? "s" : ""} available
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="food-display__empty">
          <p>No dishes found in this category.</p>
        </div>
      ) : (
        <div className="food-display__grid">
          {filtered.map((item, index) => (
            <div key={item._id} style={{animationDelay: `${index * 0.06}s`}}>
              <FoodItem
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default FoodDisplay;
