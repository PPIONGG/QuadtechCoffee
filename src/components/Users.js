import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Users.module.css";
import { AiOutlineShoppingCart, AiOutlineDelete } from "react-icons/ai";
import { GrHomeRounded } from "react-icons/gr";

function Users() {
  const [data, setData] = useState([]);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:4000/stock")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const sum = purchasedItems.reduce(
      (total, item) => total + item.selectedPrice * (item.quantity || 1),
      0
    );
    setTotalPrice(sum);
  }, [purchasedItems]);

  const handleTypeChange = (event, index) => {
    const { value } = event.target;
    const newData = [...data];
    newData[index].selectedType = value;
    setData(newData);
  };

  const incrementQuantity = (index) => {
    const newData = [...data];
    const currentQuantity = newData[index].quantity || 1;
    newData[index].quantity = currentQuantity + 1;
    setData(newData);
  };

  const decrementQuantity = (index) => {
    const newData = [...data];
    const currentQuantity = newData[index].quantity || 1;
    if (currentQuantity > 1) {
      newData[index].quantity = currentQuantity - 1;
      setData(newData);
    }
  };

  const handleBuy = (index) => {
    const { imgURL, name } = data[index];
    const selectedType = data[index].selectedType;

    // ตรวจสอบว่ารายการสินค้าที่เลือกซื้อซ้ำหรือไม่
    const isDuplicate = purchasedItems.some(
      (item) => item.name === name && item.type === selectedType
    );

    if (isDuplicate) {
      console.log("รายการนี้มีอยู่ใน purchasedItems แล้ว");
      return; // ไม่ทำการซื้อสินค้าซ้ำ
    }

    const selectedPrice = data[index].type[selectedType];

    const purchasedItem = {
      imgURL,
      name,
      type: selectedType,
      selectedPrice,
      quantity: data[index].quantity || 1,
    };

    setPurchasedItems((prevItems) => [...prevItems, purchasedItem]);
    console.log("ซื้อสินค้า:", purchasedItem);
  };

  const handleDelete = (index) => {
    setPurchasedItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const handlePayment = () => {
    console.log("ราคารวมทั้งหมด:", totalPrice);
    alert("ชำระเงินเสร็จสิ้น");
    setPurchasedItems([]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.main1}>
        <div className={styles.main1text}>
          Quadra Coffee
        </div>
        <Link to='/' className={styles.main1text1}>
          <button className={styles.Btn}>
           <div style={{marginLeft:'-0.4em',marginBottom:'-0.5em'}}><GrHomeRounded/></div>
          </button>
        </Link>
      </div>
      <div className={styles.main2}>
        <div className="divtable">
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">รูปภาพ</th>
                <th scope="col">ชื่อ</th>
                <th scope="col">ประเภท</th>
                <th scope="col">ราคา</th>
                <th scope="col">จำนวน</th>
                <th scope="col">การกระทำ</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => (
                <tr key={i}>
                  <td style={{ borderBottom: "1px solid #ceced4" }}>
                    <img
                      src={d.imgURL}
                      alt="สินค้า"
                      style={{ width: "100px", height: "100px" }}
                    />
                  </td>
                  <td style={{ borderBottom: "1px solid #ceced4" }}>
                    {d.name}
                  </td>
                  <td style={{ borderBottom: "1px solid #ceced4" }}>
                    <select
                      value={d.selectedType || ""}
                      onChange={(e) => handleTypeChange(e, i)}
                    >
                      <option value="">เลือกประเภท</option>
                      <option value="hot">ร้อน</option>
                      <option value="cold">เย็น</option>
                      <option value="smoothie">สมูทตี้</option>
                    </select>
                  </td>
                  <td style={{ borderBottom: "1px solid #ceced4" }}>
                    {d.selectedType && d.selectedType !== "เลือกประเภท" ? (
                      <>{d.type[d.selectedType]} บาท</>
                    ) : null}
                  </td>
                  <td style={{ borderBottom: "1px solid #ceced4" }}>
                    <div>
                      <button
                        className={styles.btminusplus}
                        onClick={() => decrementQuantity(i)}
                      >
                        -
                      </button>
                      <span> &nbsp;&nbsp;{d.quantity || 1}&nbsp;&nbsp;</span>
                      <button
                        className={styles.btminusplus}
                        onClick={() => incrementQuantity(i)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td style={{ borderBottom: "1px solid #ceced4" }}>
                    <button
                      className={styles.btshop}
                      onClick={() => handleBuy(i)}
                      type="button"
                      disabled={
                        !d.selectedType ||
                        d.selectedType === "เลือกประเภท" ||
                        purchasedItems.some(
                          (item) =>
                            item.name === d.name && item.type === d.selectedType
                        )
                      }
                    >
                      <AiOutlineShoppingCart />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className={styles.main3}>
        <div className={styles.card}>
          <div className={styles.textcard1}>
            <p>รายการสินค้าที่สั่งซื้อ</p>
          </div>
          <div className={styles.textcard2}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ชื่อ</th>
                  <th>ประเภท</th>
                  <th>ราคา</th>
                  <th>ราคา</th>
                  <th>ราคารวม</th>
                </tr>
              </thead>
              <tbody>
                {purchasedItems.map((item, index) => (
                  <tr>
                    <td>{item.name}</td>
                    <td>{item.type} </td>
                    <td>{item.selectedPrice} บาท </td>
                    <td>{item.quantity} แก้ว </td>
                    <td>{item.selectedPrice * item.quantity} บาท</td>
                    <td>
                      <button
                        className={styles.btdelete}
                        onClick={() => handleDelete(index)}
                      >
                        <AiOutlineDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.textcard3}>
            ราคารวมทั้งหมด: {totalPrice} บาท
            {purchasedItems.length > 0 ? (
              <button className={styles.btpayment} onClick={handlePayment}>
                ชำระเงิน
              </button>
            ) : (
              <button className={styles.btpayment} disabled>
                ชำระเงิน
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
