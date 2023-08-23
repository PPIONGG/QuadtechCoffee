import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Home.module.css";

function Home() {
  // 1. ฟังก์ชันที่จะถูกเรียกเมื่อปุ่มถูกคลิก
  const handleReservationClick = () => {
    alert("สวัสดีจ้าา");
  };

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
          {/* 2. เพิ่มปุ่ม "จองสินค้า" */}
          <div>
            <button onClick={handleReservationClick} className={styles.bt}>จองสินค้า</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
