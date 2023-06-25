import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Home.module.css";
// import img1 from "./../img/coffee.png";
function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.main1}>
        <div className={styles.textQuadra}>Quadra coffee</div>
        <div className={styles.mainbt}>
          <div>
            <NavLink to="/users" activeClassName="active-link">
              <button className={styles.bt}>Shop</button>
            </NavLink>
          </div>
          <div>
            <NavLink to="/admin" activeClassName="active-link">
              <button className={styles.bt}>Manage</button>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
